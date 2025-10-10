"""
BuffrSign-Starter: Document Service
Document upload, processing, and AI-powered analysis
"""

import os
import uuid
import base64
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, UploadFile, File, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from supabase import create_client, Client
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="BuffrSign Document Service",
    description="Document upload, processing, and AI-powered analysis",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase client initialization
supabase: Client = create_client(
    os.getenv("SUPABASE_URL", "http://localhost:54321"),
    os.getenv("SUPABASE_SERVICE_ROLE_KEY", "your-service-role-key")
)

# Pydantic models
class DocumentUploadResponse(BaseModel):
    file_id: str
    filename: str
    size: int
    public_url: str
    content_type: str
    upload_timestamp: str

class DocumentAnalysisRequest(BaseModel):
    file_id: str
    envelope_id: Optional[str] = None
    analysis_type: str = Field(default="comprehensive", regex="^(basic|comprehensive|ai_enhanced)$")

class DocumentAnalysisResponse(BaseModel):
    document_id: str
    contract_type: Optional[str]
    key_terms: List[str]
    suggested_fields: List[Dict[str, Any]]
    ai_confidence: Optional[float]
    risk_assessment: Dict[str, Any]
    compliance_check: Dict[str, Any]
    language_detection: Optional[str]
    template_match: Dict[str, Any]
    analysis_timestamp: str

class FieldSuggestion(BaseModel):
    field_type: str
    page_number: int
    x_position: int
    y_position: int
    width: int
    height: int
    confidence_score: float
    field_subtype: Optional[str] = None
    validation_rules: Dict[str, Any] = Field(default_factory=dict)
    accessibility_options: Dict[str, Any] = Field(default_factory=dict)

# Dependency to get current user (placeholder)
async def get_current_user(request: Request) -> str:
    """Get current user from request headers (placeholder for auth integration)"""
    return str(uuid.uuid4())

# Document Analysis AI (Placeholder - will be enhanced in Phase 2)
class DocumentAnalysisAI:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
    
    async def analyze_document(self, document_buffer: bytes, filename: str) -> Dict[str, Any]:
        """Analyze document for signature field placement and content extraction"""
        try:
            # Placeholder AI analysis - will be enhanced with actual AI in Phase 2
            analysis = {
                "contract_type": self._classify_contract_type(filename),
                "key_terms": self._extract_key_terms(filename),
                "suggested_fields": self._suggest_signature_fields(filename),
                "risk_assessment": self._assess_legal_risks(filename),
                "compliance_check": self._check_compliance(filename),
                "language_detection": "en",
                "template_match": self._match_template(filename),
                "ai_confidence": 0.85
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error in document analysis: {e}")
            return {
                "contract_type": "unknown",
                "key_terms": [],
                "suggested_fields": [],
                "risk_assessment": {"level": "unknown"},
                "compliance_check": {"status": "unknown"},
                "language_detection": "en",
                "template_match": {},
                "ai_confidence": 0.0
            }
    
    def _classify_contract_type(self, filename: str) -> str:
        """Classify contract type based on filename (placeholder)"""
        filename_lower = filename.lower()
        
        if any(word in filename_lower for word in ['employment', 'contract', 'agreement']):
            return 'employment_contract'
        elif any(word in filename_lower for word in ['lease', 'rental', 'property']):
            return 'lease_agreement'
        elif any(word in filename_lower for word in ['service', 'vendor', 'supplier']):
            return 'service_agreement'
        elif any(word in filename_lower for word in ['nda', 'confidentiality']):
            return 'nda_agreement'
        elif any(word in filename_lower for word in ['liability', 'waiver']):
            return 'liability_waiver'
        else:
            return 'general_contract'
    
    def _extract_key_terms(self, filename: str) -> List[str]:
        """Extract key terms (placeholder)"""
        # In Phase 2, this will use NLP to extract actual terms
        return ['payment', 'delivery', 'termination', 'liability']
    
    def _suggest_signature_fields(self, filename: str) -> List[Dict[str, Any]]:
        """Suggest signature fields (placeholder)"""
        # In Phase 2, this will use computer vision to detect signature areas
        return [
            {
                "field_type": "signHere",
                "page_number": 1,
                "x_position": 100,
                "y_position": 200,
                "width": 200,
                "height": 50,
                "confidence_score": 0.95,
                "field_subtype": None,
                "validation_rules": {"required": True},
                "accessibility_options": {"high_contrast": True}
            },
            {
                "field_type": "initialHere",
                "page_number": 1,
                "x_position": 150,
                "y_position": 200,
                "width": 100,
                "height": 30,
                "confidence_score": 0.90,
                "field_subtype": "formal",
                "validation_rules": {"required": True},
                "accessibility_options": {"high_contrast": True}
            },
            {
                "field_type": "dateSigned",
                "page_number": 1,
                "x_position": 300,
                "y_position": 200,
                "width": 120,
                "height": 30,
                "confidence_score": 0.88,
                "field_subtype": None,
                "validation_rules": {"required": True, "auto_fill": True},
                "accessibility_options": {"high_contrast": True}
            }
        ]
    
    def _assess_legal_risks(self, filename: str) -> Dict[str, Any]:
        """Assess legal risks (placeholder)"""
        return {
            "level": "low",
            "risks": ["standard_contract_terms"],
            "recommendations": ["review_payment_terms", "verify_delivery_schedule"]
        }
    
    def _check_compliance(self, filename: str) -> Dict[str, Any]:
        """Check compliance requirements (placeholder)"""
        return {
            "status": "compliant",
            "requirements": ["eIDAS", "ESIGN", "GDPR"],
            "missing_fields": []
        }
    
    def _match_template(self, filename: str) -> Dict[str, Any]:
        """Match to existing templates (placeholder)"""
        return {
            "matched_template": None,
            "similarity_score": 0.0,
            "suggested_template": "general_contract"
        }

# Initialize document analysis AI
document_ai = DocumentAnalysisAI()

# API Endpoints
@app.post("/documents/upload", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user)
):
    """Upload document for signature processing"""
    try:
        # Validate file type
        allowed_types = ['application/pdf', 'image/jpeg', 'image/png', 'image/tiff']
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400, 
                detail=f"File type {file.content_type} not supported. Allowed types: {allowed_types}"
            )
        
        # Read file content
        content = await file.read()
        
        # Generate unique file ID
        file_id = str(uuid.uuid4())
        file_path = f"documents/{file_id}_{file.filename}"
        
        # Upload to Supabase Storage
        result = supabase.storage.from_("documents").upload(file_path, content)
        
        if result:
            # Get public URL
            public_url = supabase.storage.from_("documents").get_public_url(file_path)
            
            return DocumentUploadResponse(
                file_id=file_id,
                filename=file.filename,
                size=len(content),
                public_url=public_url,
                content_type=file.content_type,
                upload_timestamp=datetime.utcnow().isoformat()
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to upload document")
            
    except Exception as e:
        logger.error(f"Error uploading document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/documents/analyze", response_model=DocumentAnalysisResponse)
async def analyze_document(
    request: DocumentAnalysisRequest,
    user_id: str = Depends(get_current_user)
):
    """Analyze document for AI-powered field suggestions"""
    try:
        # Download document from Supabase Storage
        # For now, we'll use a placeholder approach
        # In production, this would download the actual file
        
        # Perform AI analysis
        analysis = await document_ai.analyze_document(b"", request.file_id)
        
        # Store analysis results in database
        analysis_data = {
            "envelope_id": request.envelope_id,
            "document_id": request.file_id,
            "contract_type": analysis["contract_type"],
            "key_terms": analysis["key_terms"],
            "field_suggestions": analysis["suggested_fields"],
            "ai_confidence": analysis["ai_confidence"],
            "risk_assessment": analysis["risk_assessment"],
            "compliance_check": analysis["compliance_check"],
            "language_detection": analysis["language_detection"],
            "template_match": analysis["template_match"]
        }
        
        result = supabase.table("document_analysis").insert(analysis_data).execute()
        
        if result.data:
            return DocumentAnalysisResponse(
                document_id=request.file_id,
                contract_type=analysis["contract_type"],
                key_terms=analysis["key_terms"],
                suggested_fields=analysis["suggested_fields"],
                ai_confidence=analysis["ai_confidence"],
                risk_assessment=analysis["risk_assessment"],
                compliance_check=analysis["compliance_check"],
                language_detection=analysis["language_detection"],
                template_match=analysis["template_match"],
                analysis_timestamp=datetime.utcnow().isoformat()
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to store analysis results")
            
    except Exception as e:
        logger.error(f"Error analyzing document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/documents/{file_id}/analysis")
async def get_document_analysis(
    file_id: str,
    user_id: str = Depends(get_current_user)
):
    """Get document analysis results"""
    try:
        result = supabase.table("document_analysis").select("*").eq("document_id", file_id).execute()
        
        if result.data:
            return result.data[0]
        else:
            raise HTTPException(status_code=404, detail="Analysis not found")
            
    except Exception as e:
        logger.error(f"Error getting document analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/documents/suggest-fields")
async def suggest_fields(
    file_id: str,
    analysis_type: str = "comprehensive",
    user_id: str = Depends(get_current_user)
):
    """Get AI-suggested signature fields for a document"""
    try:
        # Get document analysis
        analysis_result = supabase.table("document_analysis").select("*").eq("document_id", file_id).execute()
        
        if analysis_result.data:
            analysis = analysis_result.data[0]
            return {
                "document_id": file_id,
                "suggested_fields": analysis["field_suggestions"],
                "ai_confidence": analysis["ai_confidence"],
                "contract_type": analysis["contract_type"],
                "analysis_timestamp": analysis["created_at"]
            }
        else:
            # Perform new analysis if not found
            request = DocumentAnalysisRequest(file_id=file_id, analysis_type=analysis_type)
            analysis_response = await analyze_document(request, user_id)
            
            return {
                "document_id": file_id,
                "suggested_fields": analysis_response.suggested_fields,
                "ai_confidence": analysis_response.ai_confidence,
                "contract_type": analysis_response.contract_type,
                "analysis_timestamp": analysis_response.analysis_timestamp
            }
            
    except Exception as e:
        logger.error(f"Error suggesting fields: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/documents/{file_id}")
async def get_document_info(
    file_id: str,
    user_id: str = Depends(get_current_user)
):
    """Get document information and metadata"""
    try:
        # Get document from storage
        file_path = f"documents/{file_id}"
        
        # Get file info from Supabase Storage
        files = supabase.storage.from_("documents").list()
        
        # Find the file
        document_info = None
        for file in files:
            if file_id in file.get('name', ''):
                document_info = file
                break
        
        if document_info:
            return {
                "file_id": file_id,
                "filename": document_info.get('name', ''),
                "size": document_info.get('metadata', {}).get('size', 0),
                "content_type": document_info.get('metadata', {}).get('mimetype', ''),
                "created_at": document_info.get('created_at', ''),
                "public_url": supabase.storage.from_("documents").get_public_url(file_path)
            }
        else:
            raise HTTPException(status_code=404, detail="Document not found")
            
    except Exception as e:
        logger.error(f"Error getting document info: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/documents/{file_id}")
async def delete_document(
    file_id: str,
    user_id: str = Depends(get_current_user)
):
    """Delete document from storage"""
    try:
        # Delete from Supabase Storage
        file_path = f"documents/{file_id}"
        result = supabase.storage.from_("documents").remove([file_path])
        
        if result:
            # Also delete analysis data
            supabase.table("document_analysis").delete().eq("document_id", file_id).execute()
            
            return {"status": "success", "message": "Document deleted successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to delete document")
            
    except Exception as e:
        logger.error(f"Error deleting document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "document-service",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8007)