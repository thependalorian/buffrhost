# Signature Service

**Status: Implemented (Production Ready)**

## 1. Overview

The Signature Service handles the creation and management of digital signatures for documents within the Buffr Host ecosystem. It is a core component for legal and contractual agreements.

## 2. Responsibilities

- **Envelope Management**: Creates and manages signature envelopes, which contain documents and recipient information.
- **Digital Signatures**: Captures and embeds digital signatures onto documents.
- **Authentication**: Uses JWT to ensure that only authorized users can sign documents.
- **Audit Trail**: Maintains a secure audit trail for all signature events.

## 3. API Endpoints

- `POST /api/signatures/envelopes`: Create a new signature envelope.
- `GET /api/signatures/envelopes/{id}`: Retrieve the status of a signature envelope.
- `POST /api/signatures/envelopes/{id}/sign`: Apply a signature to a document within an envelope.

_(Note: A detailed OpenAPI specification is available at the service's `/docs` endpoint.)_

## 4. Database Schema

- **Database**: Supabase (PostgreSQL)
- **Key Tables**:
  - `envelopes`: Stores information about each signature envelope.
  - `documents`: Contains the documents to be signed.
  - `signatures`: Stores the captured digital signature data and timestamps.

## 5. Configuration

| Environment Variable | Description                            | Example                          |
| -------------------- | -------------------------------------- | -------------------------------- |
| `DATABASE_URL`       | Connection string for the Supabase DB. | `postgresql://user:pass@host/db` |
| `JWT_SECRET_KEY`     | Secret key for validating JWTs.        | `a-very-secret-and-long-key`     |
