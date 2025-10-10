"""
Database utility functions for signature service
"""

import logging
from typing import Dict, List, Optional, Any, Union
from supabase import Client

logger = logging.getLogger(__name__)

class DatabaseManager:
    """Manages database operations using Supabase client"""
    
    def __init__(self, supabase_client: Client):
        self.supabase = supabase_client
    
    async def insert(self, table: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Insert a record into the database"""
        try:
            logger.debug(f"Inserting record into {table}")
            
            result = self.supabase.table(table).insert(data).execute()
            
            if result.data and len(result.data) > 0:
                logger.debug(f"Record inserted successfully into {table}")
                return result.data[0]
            else:
                logger.error(f"Failed to insert record into {table}")
                return None
                
        except Exception as e:
            logger.error(f"Error inserting record into {table}: {e}")
            raise
    
    async def get_by_id(self, table: str, record_id: str) -> Optional[Dict[str, Any]]:
        """Get a record by ID"""
        try:
            logger.debug(f"Getting record {record_id} from {table}")
            
            result = self.supabase.table(table).select("*").eq("id", record_id).execute()
            
            if result.data and len(result.data) > 0:
                logger.debug(f"Record {record_id} found in {table}")
                return result.data[0]
            else:
                logger.debug(f"Record {record_id} not found in {table}")
                return None
                
        except Exception as e:
            logger.error(f"Error getting record {record_id} from {table}: {e}")
            raise
    
    async def get_by_field(
        self, 
        table: str, 
        field: str, 
        value: Union[str, int, bool]
    ) -> List[Dict[str, Any]]:
        """Get records by field value"""
        try:
            logger.debug(f"Getting records from {table} where {field} = {value}")
            
            result = self.supabase.table(table).select("*").eq(field, value).execute()
            
            logger.debug(f"Found {len(result.data)} records in {table}")
            return result.data or []
            
        except Exception as e:
            logger.error(f"Error getting records from {table}: {e}")
            raise
    
    async def update(
        self, 
        table: str, 
        record_id: str, 
        data: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """Update a record by ID"""
        try:
            logger.debug(f"Updating record {record_id} in {table}")
            
            result = self.supabase.table(table).update(data).eq("id", record_id).execute()
            
            if result.data and len(result.data) > 0:
                logger.debug(f"Record {record_id} updated successfully in {table}")
                return result.data[0]
            else:
                logger.error(f"Failed to update record {record_id} in {table}")
                return None
                
        except Exception as e:
            logger.error(f"Error updating record {record_id} in {table}: {e}")
            raise
    
    async def delete(self, table: str, record_id: str) -> bool:
        """Delete a record by ID"""
        try:
            logger.debug(f"Deleting record {record_id} from {table}")
            
            result = self.supabase.table(table).delete().eq("id", record_id).execute()
            
            logger.debug(f"Record {record_id} deleted from {table}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting record {record_id} from {table}: {e}")
            raise
    
    async def query(
        self,
        table: str,
        filters: Optional[Dict[str, Any]] = None,
        order_by: Optional[str] = None,
        order_desc: bool = True,
        limit: Optional[int] = None,
        offset: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """Query records with filters and ordering"""
        try:
            logger.debug(f"Querying records from {table}")
            
            query = self.supabase.table(table).select("*")
            
            # Apply filters
            if filters:
                for field, value in filters.items():
                    query = query.eq(field, value)
            
            # Apply ordering
            if order_by:
                if order_desc:
                    query = query.order(order_by, desc=True)
                else:
                    query = query.order(order_by, desc=False)
            
            # Apply limit and offset
            if limit:
                query = query.limit(limit)
            
            if offset:
                query = query.range(offset, offset + (limit or 1000) - 1)
            
            result = query.execute()
            
            logger.debug(f"Query returned {len(result.data)} records from {table}")
            return result.data or []
            
        except Exception as e:
            logger.error(f"Error querying records from {table}: {e}")
            raise
    
    async def count(self, table: str, filters: Optional[Dict[str, Any]] = None) -> int:
        """Count records with optional filters"""
        try:
            logger.debug(f"Counting records in {table}")
            
            query = self.supabase.table(table).select("*", count="exact")
            
            # Apply filters
            if filters:
                for field, value in filters.items():
                    query = query.eq(field, value)
            
            result = query.execute()
            
            count = result.count or 0
            logger.debug(f"Count: {count} records in {table}")
            return count
            
        except Exception as e:
            logger.error(f"Error counting records in {table}: {e}")
            raise
    
    async def upsert(
        self, 
        table: str, 
        data: Dict[str, Any], 
        conflict_columns: List[str]
    ) -> Optional[Dict[str, Any]]:
        """Upsert a record (insert or update on conflict)"""
        try:
            logger.debug(f"Upserting record in {table}")
            
            result = self.supabase.table(table).upsert(data, on_conflict=conflict_columns).execute()
            
            if result.data and len(result.data) > 0:
                logger.debug(f"Record upserted successfully in {table}")
                return result.data[0]
            else:
                logger.error(f"Failed to upsert record in {table}")
                return None
                
        except Exception as e:
            logger.error(f"Error upserting record in {table}: {e}")
            raise
    
    async def delete_by_field(self, table: str, field: str, value: Union[str, int, bool]) -> bool:
        """Delete records by field value"""
        try:
            logger.debug(f"Deleting records from {table} where {field} = {value}")
            
            result = self.supabase.table(table).delete().eq(field, value).execute()
            
            logger.debug(f"Records deleted from {table}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting records from {table}: {e}")
            raise

def get_supabase_client() -> Client:
    """Get Supabase client instance"""
    import os
    from supabase import create_client
    
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    if not supabase_url or not supabase_key:
        raise ValueError("Missing Supabase configuration")
    
    return create_client(supabase_url, supabase_key)