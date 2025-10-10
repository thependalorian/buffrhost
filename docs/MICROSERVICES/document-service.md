# Document Service

**Status: Implemented (Medium Quality - AI Features Placeholder)**

## 1. Overview

The Document Service manages the upload, storage, and analysis of documents. It is designed to integrate with AI services for intelligent processing.

## 2. Responsibilities

-   **Document Upload**: Handles file uploads to a secure storage provider.
-   **Storage Management**: Manages document metadata and storage paths.
-   **AI Analysis (Placeholder)**: Intended to perform AI-based analysis on documents, such as OCR and field extraction. **This is not yet implemented.**
-   **Field Suggestions**: Provides suggestions for data fields based on document content.

## 3. API Endpoints

*   `POST /api/documents/upload`: Upload a new document.
*   `GET /api/documents/{id}`: Retrieve a document and its metadata.
*   `DELETE /api/documents/{id}`: Delete a document.

*(Note: A detailed OpenAPI specification is available at the service's `/docs` endpoint.)*

## 4. Database Schema

-   **Database**: Supabase (PostgreSQL)
-   **Storage**: Supabase Storage
-   **Key Tables**:
    -   `documents`: Stores metadata for each uploaded document, including its storage path.
    -   `document_fields`: Stores fields extracted from documents (intended for AI use).

## 5. Configuration

| Environment Variable      | Description                             | Example                          |
| ------------------------- | --------------------------------------- | -------------------------------- |
| `DATABASE_URL`            | Connection string for the Supabase DB.  | `postgresql://user:pass@host/db` |
| `SUPABASE_STORAGE_URL`    | URL for the Supabase Storage bucket.    | `https://<id>.supabase.co/storage/v1` |
| `SUPABASE_SERVICE_KEY`    | Service key for Supabase access.        | `ey...`                          |

