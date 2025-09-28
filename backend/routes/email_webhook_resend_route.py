from typing import Any, Dict, List

from fastapi import APIRouter, HTTPException, Request, status

router = APIRouter()


@router.post("/webhook/resend", status_code=status.HTTP_200_OK)
async def handle_resend_webhook(request: Request):
    # Placeholder for handling Resend webhook events
    payload = await request.json()
    print(f"Received Resend webhook event: {payload}")
    # Process events like delivered, bounced, opened, clicked, etc.
    return {"message": "Resend webhook received"}
