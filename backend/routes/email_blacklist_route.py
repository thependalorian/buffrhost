from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr

router = APIRouter()


class BlacklistItem(BaseModel):
    id: Optional[str] = None
    email: EmailStr
    reason: Optional[str] = None
    created_at: Optional[str] = None


@router.get("/blacklist", status_code=status.HTTP_200_OK)
async def get_email_blacklist():
    # Placeholder for fetching email blacklist items
    mock_blacklist = [
        {
            "id": "bl1",
            "email": "spam1@example.com",
            "reason": "User complaint",
            "created_at": "2025-09-01T00:00:00Z",
        },
        {
            "id": "bl2",
            "email": "spam2@example.com",
            "reason": "Hard bounce",
            "created_at": "2025-09-10T00:00:00Z",
        },
    ]
    return mock_blacklist


@router.post("/blacklist", status_code=status.HTTP_201_CREATED)
async def add_to_email_blacklist(item: BlacklistItem):
    # Placeholder for adding email to blacklist
    print(f"Adding {item.email} to blacklist")
    item.id = "new_blacklist_id"
    item.created_at = "2025-09-22T10:30:00Z"
    return item


@router.delete("/blacklist/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_email_blacklist(item_id: str):
    # Placeholder for removing email from blacklist
    print(f"Removing {item_id} from blacklist")
    return
