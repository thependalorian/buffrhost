from typing import Any, Dict, List

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr

router = APIRouter()


class EmailSendRequest(BaseModel):
    recipients: List[EmailStr]
    subject: str
    body: str
    email_type: str
    context: Dict[str, Any] = {}


@router.post("/send", status_code=status.HTTP_200_OK)
async def send_email(request: EmailSendRequest):
    # Placeholder for email sending logic
    # This would typically involve calling an email service
    print(f"Sending email to {request.recipients} with subject {request.subject}")
    return {"message": "Email sent successfully", "recipients": request.recipients}
