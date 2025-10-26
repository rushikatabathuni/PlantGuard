from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
from passlib.context import CryptContext
from jose import JWTError, jwt
import os
import shutil
from typing import Optional
from datetime import timedelta


# Import your modules
from disease_detector import DiseaseDetector
from knowledge_base import get_advisory

app = FastAPI(title="PlantGuard API", version="1.0.0")

# CORS - Update with your Vercel URL after deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://*.vercel.app",
        "https://plant-guard-two.vercel.app/"  # Update after Vercel deployment
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
DATABASE_URL = "sqlite:////data/app.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# Database models
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)

class Detection(Base):
    __tablename__ = "detections"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    disease_class = Column(String)
    confidence = Column(Float)
    advisory = Column(String)
    created_at = Column(DateTime, default=datetime.now)
    feedback = Column(Boolean, nullable=True)

Base.metadata.create_all(bind=engine)

# Authentication
pwd_context = CryptContext(schemes=["bcrypt"])
SECRET_KEY = "your-secret-key-for-jwt"  # Change this in production

def get_password_hash(password):
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"])
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"])
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(authorization: str = Depends(lambda: None)):
    # Simplified authentication for demo
    # In production, implement full JWT validation
    return "demo-user"

# Initialize detector
from disease_detector import DiseaseDetector
detector = DiseaseDetector(hf_repo_id="rushikatabathuni/plantguard-vit")

# Routes
@app.get("/")
async def root():
    return {"message": "PlantGuard API", "status": "online", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {
        "status": "healthy", 
        "database": "connected", 
        "model": "loaded",
        "hf_repo": "rushikatabathuni/plantguard-vit"
    }

# Auth routes
@app.post("/auth/register")
async def register(
    username: str,
    email: str,
    password: str,
    db: Session = Depends(get_db)
):
    # Check if user exists
    existing_user = db.query(User).filter(
        (User.username == username) | (User.email == email)
    ).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    
    # Create user
    hashed_password = get_password_hash(password)
    new_user = User(username=username, email=email, password_hash=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "User created successfully", "username": username}

@app.post("/auth/login")
async def login(
    username: str,
    password: str,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == username).first()
    
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create access token
    access_token = create_access_token(data={"sub": username})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": username
    }
@app.post("/detect")
async def detect_disease(
    file: UploadFile = File(...),
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Save uploaded file in /tmp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{current_user}_{timestamp}_{file.filename}"
        file_path = os.path.join("/tmp", filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Detect disease
        result = detector.predict(file_path)
        if not result['success']:
            raise HTTPException(status_code=500, detail=result.get('error', 'Prediction failed'))
        
        # Get advisory
        advisory = get_advisory(result['disease_class'])
        
        # Save detection to DB
        new_detection = Detection(
            username=current_user,
            disease_class=result['disease_class'],
            confidence=result['confidence'],
            advisory=advisory,
            created_at=datetime.now()
        )
        db.add(new_detection)
        db.commit()
        db.refresh(new_detection)
        
        # Cleanup
        os.remove(file_path)
        
        return {
            "detection_id": new_detection.id,
            "disease": result['disease_class'],
            "confidence": result['confidence'],
            "advisory": advisory,
            "top_predictions": result.get('top_3_predictions', [])
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# History route
@app.get("/history")
async def get_history(
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    detections = db.query(Detection).filter(
        Detection.username == current_user
    ).order_by(Detection.created_at.desc()).limit(20).all()
    
    return {
        "total": len(detections),
        "detections": [
            {
                "id": d.id,
                "disease": d.disease_class,
                "confidence": d.confidence,
                "advisory": d.advisory,
                "timestamp": d.created_at.isoformat()
            }
            for d in detections
        ]
    }

# Feedback route
@app.post("/feedback")
async def submit_feedback(
    detection_id: int,
    accurate: bool,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    detection = db.query(Detection).filter(
        Detection.id == detection_id,
        Detection.username == current_user
    ).first()
    
    if not detection:
        raise HTTPException(status_code=404, detail="Detection not found")
    
    detection.feedback = accurate
    db.commit()
    
    return {"message": "Feedback recorded", "detection_id": detection_id}

# Admin routes
@app.get("/admin/stats")
async def admin_stats(db: Session = Depends(get_db)):
    # Total users
    total_users = db.query(User).count()
    
    # Total detections
    total_detections = db.query(Detection).count()
    
    # Feedback stats
    helpful_count = db.query(Detection).filter(Detection.feedback == True).count()
    not_helpful_count = db.query(Detection).filter(Detection.feedback == False).count()
    
    # Recent detections
    recent_detections = db.query(Detection).order_by(Detection.created_at.desc()).limit(10).all()
    
    return {
        "total_users": total_users,
        "total_detections": total_detections,
        "feedback": {
            "helpful": helpful_count,
            "not_helpful": not_helpful_count
        },
        "recent_detections": [
            {
                "disease": d.disease_class,
                "confidence": d.confidence,
                "timestamp": d.created_at.isoformat()
            }
            for d in recent_detections
        ]
    }

# Admin user list
@app.get("/admin/users")
async def admin_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    detections = db.query(Detection).all()
    
    user_stats = []
    for user in users:
        detection_count = len([d for d in detections if d.username == user.username])
        user_stats.append({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "detection_count": detection_count
        })
    
    return {"users": user_stats}
