import os
os.environ["HF_HOME"] = "/data/hf_home"
import torch
import json
from PIL import Image
from transformers import ViTForImageClassification, ViTImageProcessor
from torchvision import transforms
from pathlib import Path
import logging
from huggingface_hub import hf_hub_download

logger = logging.getLogger(__name__)


class DiseaseDetector:
    def __init__(self, hf_repo_id="rushikatabathuni/plantguard-vit", device="cpu"):
        """Initialize detector with model from Hugging Face Hub"""
        self.device = torch.device(device)
        logger.info(f"Initializing DiseaseDetector on device: {self.device}")
        
        try:
            # Download model from Hugging Face
            logger.info(f"Downloading model from {hf_repo_id}")
            model_path = hf_hub_download(
                repo_id=hf_repo_id,
                filename="best_model.pth",
                cache_dir="/data/hf_cache"
            )
            class_names_path = hf_hub_download(
                repo_id=hf_repo_id,
                filename="class_names.json",
                cache_dir="/data/hf_cache"
            )

            logger.info("✓ Model files downloaded from HuggingFace Hub!")
            
        except Exception as e:
            logger.error(f"Failed to download from HuggingFace: {e}")
            raise FileNotFoundError(f"Could not download model from {hf_repo_id}: {e}")
        
        # Load class names
        with open(class_names_path, 'r') as f:
            self.class_mapping = json.load(f)
        self.class_names = [self.class_mapping[str(i)] for i in range(len(self.class_mapping))]
        logger.info(f"Loaded {len(self.class_names)} classes")
        
        # Load model
        logger.info("Loading ViT model...")
        self.model = ViTForImageClassification.from_pretrained(
            'google/vit-base-patch16-224',
            num_labels=len(self.class_names),
            ignore_mismatched_sizes=True
        )
        
        # Load trained weights
        checkpoint = torch.load(model_path, map_location=self.device)
        
        # Handle DataParallel weights (remove 'module.' prefix if present)
        state_dict = checkpoint['model_state_dict']
        new_state_dict = {}
        for key, value in state_dict.items():
            new_key = key.replace('module.', '') if key.startswith('module.') else key
            new_state_dict[new_key] = value
        
        self.model.load_state_dict(new_state_dict)
        self.model.to(self.device)
        self.model.eval()
        logger.info("Model loaded successfully!")
        
        # Setup image preprocessing
        self.image_processor = ViTImageProcessor.from_pretrained('google/vit-base-patch16-224')
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=self.image_processor.image_mean,
                std=self.image_processor.image_std
            )
        ])
    
    def predict(self, image_path: str):
        """
        Predict disease from image path
        
        Args:
            image_path: Path to image file
            
        Returns:
            dict with disease_class, confidence, top_3_predictions, success
        """
        try:
            # Load and preprocess image
            image = Image.open(image_path).convert('RGB')
            input_tensor = self.transform(image).unsqueeze(0).to(self.device)
            
            # Inference
            with torch.no_grad():
                outputs = self.model(input_tensor)
                logits = outputs.logits
                probabilities = torch.nn.functional.softmax(logits, dim=1)
                
                # Top prediction
                confidence, predicted_idx = torch.max(probabilities, 1)
                predicted_class = self.class_names[predicted_idx.item()]
                confidence_score = confidence.item()
                
                # Top 3 predictions
                top3_prob, top3_idx = torch.topk(probabilities, 3, dim=1)
                top3_predictions = [
                    {
                        "disease": self.class_names[idx.item()],
                        "confidence": prob.item()
                    }
                    for prob, idx in zip(top3_prob[0], top3_idx[0])
                ]
            
            return {
                "disease_class": predicted_class,
                "confidence": confidence_score,
                "top_3_predictions": top3_predictions,
                "success": True
            }
        
        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            return {
                "disease_class": None,
                "confidence": 0.0,
                "error": str(e),
                "success": False
            }
    
    def predict_pil(self, image: Image.Image):
        """
        Predict disease from PIL image (for Gradio or direct image input)
        
        Args:
            image: PIL Image object
            
        Returns:
            dict with disease_class, confidence, top_3_predictions, success
        """
        try:
            # Preprocess PIL image
            input_tensor = self.transform(image.convert('RGB')).unsqueeze(0).to(self.device)
            
            # Inference
            with torch.no_grad():
                outputs = self.model(input_tensor)
                logits = outputs.logits
                probabilities = torch.nn.functional.softmax(logits, dim=1)
                
                # Top prediction
                confidence, predicted_idx = torch.max(probabilities, 1)
                predicted_class = self.class_names[predicted_idx.item()]
                confidence_score = confidence.item()
                
                # Top 3 predictions
                top3_prob, top3_idx = torch.topk(probabilities, 3, dim=1)
                top3_predictions = [
                    {
                        "disease": self.class_names[idx.item()],
                        "confidence": prob.item()
                    }
                    for prob, idx in zip(top3_prob[0], top3_idx[0])
                ]
            
            return {
                "disease_class": predicted_class,
                "confidence": confidence_score,
                "top_3_predictions": top3_predictions,
                "success": True
            }
        
        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            return {
                "disease_class": None,
                "confidence": 0.0,
                "error": str(e),
                "success": False
            }
