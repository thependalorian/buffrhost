
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

router = APIRouter()

class EmailTemplate(BaseModel):
    id: Optional[str] = None
    name: str
    subject: str
    body: str
    variables: List[str] = []

@router.get("/templates", status_code=status.HTTP_200_OK)
async def get_email_templates():
    # Placeholder for fetching email templates
    mock_templates = [
        {"id": "1", "name": "Booking Confirmation", "subject": "Your Booking is Confirmed!", "body": "...", "variables": ["guest_name", "booking_id"]},
        {"id": "2", "name": "Cancellation Notice", "subject": "Booking Cancelled", "body": "...", "variables": ["guest_name", "booking_id"]},
    ]
    return mock_templates

@router.post("/templates", status_code=status.HTTP_201_CREATED)
async def create_email_template(template: EmailTemplate):
    # Placeholder for creating an email template
    print(f"Creating template: {template.name}")
    template.id = "new_template_id"
    return template

@router.put("/templates/{template_id}", status_code=status.HTTP_200_OK)
async def update_email_template(template_id: str, template: EmailTemplate):
    # Placeholder for updating an email template
    print(f"Updating template {template_id}: {template.name}")
    return {"message": "Template updated successfully"}

@router.delete("/templates/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_email_template(template_id: str):
    # Placeholder for deleting an email template
    print(f"Deleting template {template_id}")
    return
