"""
Signature Manager Service
Handles core signature envelope management and digital signature processing
"""

import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
from uuid import uuid4

from supabase import Client
from models.signature_models import (
    EnvelopeCreateRequest, EnvelopeResponse, EnvelopeUpdateRequest,
    SignatureFieldRequest, EnvelopeStatus, EnvelopeStatusResponse,
    SignatureRecipientResponse, SignatureFieldResponse
)
from utils.database import DatabaseManager
from utils.validation import validate_envelope_data, validate_signature_data

logger = logging.getLogger(__name__)

class SignatureManager:
    """Manages signature envelopes and digital signature processing"""
    
    def __init__(self, supabase_client: Client):
        self.supabase = supabase_client
        self.db_manager = DatabaseManager(supabase_client)
    
    async def create_envelope(
        self, 
        request: EnvelopeCreateRequest, 
        user_id: str
    ) -> EnvelopeResponse:
        """Create a new signature envelope"""
        try:
            logger.info(f"Creating envelope '{request.envelope_name}' for user {user_id}")
            
            # Validate envelope data
            await validate_envelope_data(request.dict())
            
            # Generate envelope ID
            envelope_id = str(uuid4())
            
            # Prepare envelope data
            envelope_data = {
                "id": envelope_id,
                "envelope_name": request.envelope_name,
                "description": request.description,
                "status": EnvelopeStatus.DRAFT.value,
                "compliance_level": request.compliance_level.value,
                "created_by": user_id,
                "metadata": request.metadata or {},
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
            
            # Insert envelope into database
            result = await self.db_manager.insert(
                table="signature_envelopes",
                data=envelope_data
            )
            
            if not result:
                raise Exception("Failed to create envelope in database")
            
            # Add recipients if provided
            if request.recipients:
                await self._add_envelope_recipients(envelope_id, request.recipients)
            
            # Add fields if provided
            if request.fields:
                await self._add_envelope_fields(envelope_id, request.fields)
            
            logger.info(f"Envelope created successfully: {envelope_id}")
            
            # Return envelope response
            return EnvelopeResponse(
                id=envelope_id,
                envelope_name=request.envelope_name,
                description=request.description,
                status=EnvelopeStatus.DRAFT,
                compliance_level=request.compliance_level,
                created_by=user_id,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
                metadata=request.metadata
            )
            
        except Exception as e:
            logger.error(f"Failed to create envelope: {e}")
            raise
    
    async def get_envelope(self, envelope_id: str, user_id: str) -> Optional[EnvelopeResponse]:
        """Get envelope details"""
        try:
            logger.info(f"Getting envelope {envelope_id} for user {user_id}")
            
            # Get envelope from database
            envelope = await self.db_manager.get_by_id(
                table="signature_envelopes",
                record_id=envelope_id
            )
            
            if not envelope:
                logger.warning(f"Envelope {envelope_id} not found")
                return None
            
            # Check user access
            if envelope["created_by"] != user_id:
                logger.warning(f"User {user_id} not authorized to access envelope {envelope_id}")
                return None
            
            # Get related data
            recipients = await self._get_envelope_recipients(envelope_id)
            fields = await self._get_envelope_fields(envelope_id)
            
            # Convert to response model
            return EnvelopeResponse(
                id=envelope["id"],
                envelope_name=envelope["envelope_name"],
                description=envelope.get("description"),
                status=EnvelopeStatus(envelope["status"]),
                compliance_level=envelope["compliance_level"],
                created_by=envelope["created_by"],
                created_at=datetime.fromisoformat(envelope["created_at"]),
                updated_at=datetime.fromisoformat(envelope["updated_at"]),
                completed_at=datetime.fromisoformat(envelope["completed_at"]) if envelope.get("completed_at") else None,
                metadata=envelope.get("metadata"),
                recipients=recipients,
                fields=fields
            )
            
        except Exception as e:
            logger.error(f"Failed to get envelope {envelope_id}: {e}")
            raise
    
    async def update_envelope(
        self, 
        envelope_id: str, 
        request: EnvelopeUpdateRequest, 
        user_id: str
    ) -> Optional[EnvelopeResponse]:
        """Update envelope details"""
        try:
            logger.info(f"Updating envelope {envelope_id} for user {user_id}")
            
            # Check if envelope exists and user has access
            existing_envelope = await self.get_envelope(envelope_id, user_id)
            if not existing_envelope:
                return None
            
            # Prepare update data
            update_data = {
                "updated_at": datetime.utcnow().isoformat()
            }
            
            if request.envelope_name is not None:
                update_data["envelope_name"] = request.envelope_name
            if request.description is not None:
                update_data["description"] = request.description
            if request.status is not None:
                update_data["status"] = request.status.value
            if request.metadata is not None:
                update_data["metadata"] = request.metadata
            
            # Update envelope in database
            result = await self.db_manager.update(
                table="signature_envelopes",
                record_id=envelope_id,
                data=update_data
            )
            
            if not result:
                raise Exception("Failed to update envelope in database")
            
            # Update recipients if provided
            if request.recipients is not None:
                await self._update_envelope_recipients(envelope_id, request.recipients)
            
            # Update fields if provided
            if request.fields is not None:
                await self._update_envelope_fields(envelope_id, request.fields)
            
            logger.info(f"Envelope {envelope_id} updated successfully")
            
            # Return updated envelope
            return await self.get_envelope(envelope_id, user_id)
            
        except Exception as e:
            logger.error(f"Failed to update envelope {envelope_id}: {e}")
            raise
    
    async def delete_envelope(self, envelope_id: str, user_id: str) -> bool:
        """Delete an envelope"""
        try:
            logger.info(f"Deleting envelope {envelope_id} for user {user_id}")
            
            # Check if envelope exists and user has access
            existing_envelope = await self.get_envelope(envelope_id, user_id)
            if not existing_envelope:
                return False
            
            # Delete envelope from database (cascade will handle related records)
            result = await self.db_manager.delete(
                table="signature_envelopes",
                record_id=envelope_id
            )
            
            if result:
                logger.info(f"Envelope {envelope_id} deleted successfully")
                return True
            else:
                logger.error(f"Failed to delete envelope {envelope_id}")
                return False
                
        except Exception as e:
            logger.error(f"Failed to delete envelope {envelope_id}: {e}")
            raise
    
    async def sign_field(
        self, 
        envelope_id: str, 
        field_id: str, 
        signature_data: str, 
        user_id: str
    ) -> bool:
        """Sign a field in an envelope"""
        try:
            logger.info(f"Signing field {field_id} in envelope {envelope_id}")
            
            # Validate signature data
            await validate_signature_data(signature_data)
            
            # Check if envelope exists and user has access
            envelope = await self.get_envelope(envelope_id, user_id)
            if not envelope:
                return False
            
            # Update field with signature data
            field_data = {
                "is_signed": True,
                "signature_data": signature_data,
                "signed_at": datetime.utcnow().isoformat(),
                "signed_by": user_id
            }
            
            result = await self.db_manager.update(
                table="signature_fields",
                record_id=field_id,
                data=field_data
            )
            
            if result:
                # Update envelope status if all fields are signed
                await self._update_envelope_status_if_complete(envelope_id)
                logger.info(f"Field {field_id} signed successfully")
                return True
            else:
                logger.error(f"Failed to sign field {field_id}")
                return False
                
        except Exception as e:
            logger.error(f"Failed to sign field {field_id}: {e}")
            raise
    
    async def get_envelope_status(self, envelope_id: str, user_id: str) -> Optional[EnvelopeStatusResponse]:
        """Get envelope status and progress"""
        try:
            # Check if envelope exists and user has access
            envelope = await self.get_envelope(envelope_id, user_id)
            if not envelope:
                return None
            
            # Get field statistics
            fields = await self._get_envelope_fields(envelope_id)
            completed_fields = sum(1 for field in fields if field.is_signed)
            total_fields = len(fields)
            
            # Get recipient statistics
            recipients = await self._get_envelope_recipients(envelope_id)
            completed_recipients = sum(1 for recipient in recipients if recipient.status == "completed")
            total_recipients = len(recipients)
            
            # Calculate progress percentage
            progress_percentage = 0
            if total_fields > 0:
                progress_percentage = (completed_fields / total_fields) * 100
            
            return EnvelopeStatusResponse(
                envelope_id=envelope_id,
                status=envelope.status,
                progress_percentage=progress_percentage,
                completed_fields=completed_fields,
                total_fields=total_fields,
                completed_recipients=completed_recipients,
                total_recipients=total_recipients,
                last_activity=envelope.updated_at
            )
            
        except Exception as e:
            logger.error(f"Failed to get envelope status {envelope_id}: {e}")
            raise
    
    async def list_user_envelopes(
        self,
        user_id: str,
        status_filter: Optional[EnvelopeStatus] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[EnvelopeResponse]:
        """List envelopes for a user"""
        try:
            logger.info(f"Listing envelopes for user {user_id}")
            
            # Build query
            filters = {"created_by": user_id}
            if status_filter:
                filters["status"] = status_filter.value
            
            envelopes = await self.db_manager.query(
                table="signature_envelopes",
                filters=filters,
                order_by="created_at",
                order_desc=True,
                limit=limit,
                offset=offset
            )
            
            # Convert to response models
            result = []
            for envelope_data in envelopes:
                envelope = EnvelopeResponse(
                    id=envelope_data["id"],
                    envelope_name=envelope_data["envelope_name"],
                    description=envelope_data.get("description"),
                    status=EnvelopeStatus(envelope_data["status"]),
                    compliance_level=envelope_data["compliance_level"],
                    created_by=envelope_data["created_by"],
                    created_at=datetime.fromisoformat(envelope_data["created_at"]),
                    updated_at=datetime.fromisoformat(envelope_data["updated_at"]),
                    completed_at=datetime.fromisoformat(envelope_data["completed_at"]) if envelope_data.get("completed_at") else None,
                    metadata=envelope_data.get("metadata")
                )
                result.append(envelope)
            
            logger.info(f"Found {len(result)} envelopes for user {user_id}")
            return result
            
        except Exception as e:
            logger.error(f"Failed to list envelopes for user {user_id}: {e}")
            raise
    
    # Private helper methods
    async def _add_envelope_recipients(self, envelope_id: str, recipients: List[Dict[str, Any]]):
        """Add recipients to an envelope"""
        try:
            for recipient_data in recipients:
                recipient_id = str(uuid4())
                
                recipient_record = {
                    "id": recipient_id,
                    "envelope_id": envelope_id,
                    "email": recipient_data["email"],
                    "name": recipient_data["name"],
                    "recipient_type": recipient_data.get("recipient_type", "signer"),
                    "status": "pending",
                    "created_at": datetime.utcnow().isoformat()
                }
                
                await self.db_manager.insert(
                    table="signature_recipients",
                    data=recipient_record
                )
            
            logger.info(f"Added {len(recipients)} recipients to envelope {envelope_id}")
            
        except Exception as e:
            logger.error(f"Failed to add recipients to envelope {envelope_id}: {e}")
            raise
    
    async def _add_envelope_fields(self, envelope_id: str, fields: List[Dict[str, Any]]):
        """Add fields to an envelope"""
        try:
            for field_data in fields:
                field_id = str(uuid4())
                
                field_record = {
                    "id": field_id,
                    "envelope_id": envelope_id,
                    "field_type": field_data.get("field_type", "signHere"),
                    "field_name": field_data.get("field_name", "Untitled Field"),
                    "page_number": field_data.get("page_number", 1),
                    "x_position": field_data.get("x_position", 0.0),
                    "y_position": field_data.get("y_position", 0.0),
                    "width": field_data.get("width", 100.0),
                    "height": field_data.get("height", 50.0),
                    "is_required": field_data.get("is_required", True),
                    "is_signed": False,
                    "created_at": datetime.utcnow().isoformat()
                }
                
                await self.db_manager.insert(
                    table="signature_fields",
                    data=field_record
                )
            
            logger.info(f"Added {len(fields)} fields to envelope {envelope_id}")
            
        except Exception as e:
            logger.error(f"Failed to add fields to envelope {envelope_id}: {e}")
            raise
    
    async def _get_envelope_recipients(self, envelope_id: str) -> List[SignatureRecipientResponse]:
        """Get recipients for an envelope"""
        try:
            recipients_data = await self.db_manager.get_by_field(
                table="signature_recipients",
                field="envelope_id",
                value=envelope_id
            )
            
            recipients = []
            for recipient_data in recipients_data:
                recipient = SignatureRecipientResponse(
                    id=recipient_data["id"],
                    email=recipient_data["email"],
                    name=recipient_data["name"],
                    recipient_type=recipient_data["recipient_type"],
                    status=recipient_data["status"],
                    signed_at=datetime.fromisoformat(recipient_data["signed_at"]) if recipient_data.get("signed_at") else None,
                    authentication_method=recipient_data.get("authentication_method")
                )
                recipients.append(recipient)
            
            return recipients
            
        except Exception as e:
            logger.error(f"Failed to get recipients for envelope {envelope_id}: {e}")
            return []
    
    async def _get_envelope_fields(self, envelope_id: str) -> List[SignatureFieldResponse]:
        """Get fields for an envelope"""
        try:
            fields_data = await self.db_manager.get_by_field(
                table="signature_fields",
                field="envelope_id",
                value=envelope_id
            )
            
            fields = []
            for field_data in fields_data:
                field = SignatureFieldResponse(
                    id=field_data["id"],
                    field_type=field_data["field_type"],
                    field_name=field_data["field_name"],
                    page_number=field_data["page_number"],
                    x_position=field_data["x_position"],
                    y_position=field_data["y_position"],
                    width=field_data["width"],
                    height=field_data["height"],
                    is_required=field_data["is_required"],
                    is_signed=field_data["is_signed"],
                    signed_at=datetime.fromisoformat(field_data["signed_at"]) if field_data.get("signed_at") else None,
                    signature_data=field_data.get("signature_data")
                )
                fields.append(field)
            
            return fields
            
        except Exception as e:
            logger.error(f"Failed to get fields for envelope {envelope_id}: {e}")
            return []
    
    async def _update_envelope_recipients(self, envelope_id: str, recipients: List[Dict[str, Any]]):
        """Update envelope recipients"""
        try:
            # Delete existing recipients
            await self.db_manager.delete_by_field(
                table="signature_recipients",
                field="envelope_id",
                value=envelope_id
            )
            
            # Add new recipients
            await self._add_envelope_recipients(envelope_id, recipients)
            
            logger.info(f"Updated recipients for envelope {envelope_id}")
            
        except Exception as e:
            logger.error(f"Failed to update recipients for envelope {envelope_id}: {e}")
            raise
    
    async def _update_envelope_fields(self, envelope_id: str, fields: List[Dict[str, Any]]):
        """Update envelope fields"""
        try:
            # Delete existing fields
            await self.db_manager.delete_by_field(
                table="signature_fields",
                field="envelope_id",
                value=envelope_id
            )
            
            # Add new fields
            await self._add_envelope_fields(envelope_id, fields)
            
            logger.info(f"Updated fields for envelope {envelope_id}")
            
        except Exception as e:
            logger.error(f"Failed to update fields for envelope {envelope_id}: {e}")
            raise
    
    async def _update_envelope_status_if_complete(self, envelope_id: str):
        """Update envelope status to completed if all fields are signed"""
        try:
            # Get all fields for the envelope
            fields = await self._get_envelope_fields(envelope_id)
            
            # Check if all required fields are signed
            all_signed = all(field.is_signed for field in fields if field.is_required)
            
            if all_signed:
                # Update envelope status to completed
                await self.db_manager.update(
                    table="signature_envelopes",
                    record_id=envelope_id,
                    data={
                        "status": EnvelopeStatus.COMPLETED.value,
                        "completed_at": datetime.utcnow().isoformat(),
                        "updated_at": datetime.utcnow().isoformat()
                    }
                )
                
                logger.info(f"Envelope {envelope_id} marked as completed")
            
        except Exception as e:
            logger.error(f"Failed to update envelope status for {envelope_id}: {e}")
            raise