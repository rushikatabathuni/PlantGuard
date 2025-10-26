from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
from passlib.context import CryptContext
from jose import JWTError, jwt
import os
import shutil
from typing import Optional, List
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
        "https://plant-guard-two.vercel.app" # Your specific Vercel URL
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
    username = Column(String) # Links to User.username
    disease_class = Column(String)
    confidence = Column(Float)
    advisory = Column(String)
    created_at = Column(DateTime, default=datetime.now)
    feedback = Column(Boolean, nullable=True)

Base.metadata.create_all(bind=engine)

# Authentication
pwd_context = CryptContext(schemes=["bcrypt"])
SECRET_KEY = "your-secret-key-for-jwt"  # Change this in production
ADMIN_EMAIL = "admin@plantguard.com" # Admin user identifier

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
        # Increased token expiry time
        expire = datetime.utcnow() + timedelta(days=1)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# === NEW AUTH DEPENDENCIES ===

async def get_current_user(
    authorization: Optional[str] = Header(None), 
    db: Session = Depends(get_db)
) -> User:
    """
    Decodes the JWT token from the Authorization header and returns the User object.
    """
    if authorization is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise ValueError("Invalid auth scheme")
    except ValueError:
            raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

async def get_current_username(user: User = Depends(get_current_user)) -> str:
    """Returns the username string of the current user."""
    return user.username

def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """
    Checks if the current user is an admin.
    Raises 403 Forbidden if not.
    """
    if current_user.email != ADMIN_EMAIL:
         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user

# Initialize detector
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
    existing_user = db.query(User).filter(
        (User.username == username) | (User.email == email)
    ).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    
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
    
    access_token = create_access_token(data={"sub": username})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": username,
        "email": user.email # Added email for frontend
    }

@app.post("/detect")
async def detect_disease(
    file: UploadFile = File(...),
    # Use new auth dependency
    current_user: str = Depends(get_current_username), 
    db: Session = Depends(get_db)
):
    try:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{current_user}_{timestamp}_{file.filename}"
        file_path = os.path.join("/tmp", filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        result = detector.predict(file_path)
        if not result['success']:
            raise HTTPException(status_code=500, detail=result.get('error', 'Prediction failed'))
        
        advisory = get_advisory(result['disease_class'])
        
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

# History route - UPDATED with pagination
@app.get("/history")
async def get_history(
    skip: int = 0,
    limit: int = 20,
    current_user: str = Depends(get_current_username), # Use new auth dependency
    db: Session = Depends(get_db)
):
    # Get total count for pagination
    total_count = db.query(Detection).filter(
        Detection.username == current_user
    ).count()

    # Get paginated detections
    detections = db.query(Detection).filter(
        Detection.username == current_user
    ).order_by(Detection.created_at.desc()).offset(skip).limit(limit).all()
    
    return {
        "total": total_count, # Total detections for this user
        "detections": [
            {
                "id": d.id,
                "disease": d.disease_class,
                "confidence": d.confidence,
                "advisory": d.advisory,
                "timestamp": d.created_at.isoformat(),
                "feedback": d.feedback # Added feedback
            }
            for d in detections
        ]
    }

# Feedback route
@app.post("/feedback")
async def submit_feedback(
    detection_id: int,
    accurate: bool,
    current_user: str = Depends(get_current_username), # Use new auth dependency
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

# === ADMIN ROUTES ===

# Admin routes - UPDATED with new stats and auth
@app.get("/admin/stats")
async def admin_stats(
    db: Session = Depends(get_db), 
    admin: User = Depends(get_admin_user) # Use admin auth
):
    total_users = db.query(User).count()
    total_detections = db.query(Detection).count()
    
    # Feedback stats
    helpful_count = db.query(Detection).filter(Detection.feedback == True).count()
    not_helpful_count = db.query(Detection).filter(Detection.feedback == False).count()
    pending_count = db.query(Detection).filter(Detection.feedback == None).count()
    
    total_feedback = helpful_count + not_helpful_count
    accuracy = (helpful_count / total_feedback * 100) if total_feedback > 0 else 0

    # Top diseases (using SQLAlchemy)
    top_diseases_query = db.query(
        Detection.disease_class, 
        func.count(Detection.disease_class).label('count'), 
        func.avg(Detection.confidence).label('avg_confidence')
    ).group_by(Detection.disease_class).order_by(func.count(Detection.disease_class).desc()).limit(10).all()

    top_diseases = [
        {
            "disease": d[0],
            "count": d[1],
            "avg_confidence": round(d[2], 4) if d[2] else 0
        }
        for d in top_diseases_query
    ]
    
    return {
        "total_users": total_users,
        "total_detections": total_detections,
        "feedback": {
            "helpful": helpful_count,
            "not_helpful": not_helpful_count,
            "pending": pending_count,
            "accuracy_rate": round(accuracy, 2)
        },
        "top_diseases": top_diseases
    }

# Admin user list - UPDATED with efficient query and auth
@app.get("/admin/users")
async def admin_users(
    db: Session = Depends(get_db), 
    admin: User = Depends(get_admin_user) # Use admin auth
):
    # Efficient query with JOIN and GROUP BY
    user_stats_query = db.query(
        User.id,
        User.username,
        User.email,
        func.count(Detection.id).label('detection_count')
    ).outerjoin(Detection, User.username == Detection.username).group_by(User.id, User.username, User.email).order_by(func.count(Detection.id).desc()).all()
    
    user_stats = [
        {
            "id": u[0],
            "username": u[1],
            "email": u[2],
            "detection_count": u[3]
        }
        for u in user_stats_query
    ]
    
    return {"users": user_stats}

# --- NEW ADMIN ENDPOINT ---
@app.get("/admin/recent-detections")
async def admin_recent_detections(
    skip: int = 0,
    limit: int = 50, # Default limit from your frontend request
    db: Session = Depends(get_db), 
    admin: User = Depends(get_admin_user) # Use admin auth
):
    """
    Fetches paginated recent detections across ALL users.
    """
    total_count = db.query(Detection).count()
    
    detections_query = db.query(Detection).order_by(Detection.created_at.desc()).offset(skip).limit(limit).all()

    detections = [
        {
            "id": d.id,
            "username": d.username,
            "disease": d.disease_class,
            "confidence": d.confidence,
            "feedback": d.feedback,
            "timestamp": d.created_at.isoformat()
        }
        for d in detections_query
    ]
    
    return {
        "total": total_count,
        "detections": detections
    }
