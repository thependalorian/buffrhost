# Template Service

**Status: Implemented (Production Ready)**

## 1. Overview

The Template Service manages document templates, particularly for hospitality forms and signature workflows.

## 2. Responsibilities

- **Template Management**: Handles CRUD operations for various document templates.
- **Hospitality Forms**: Manages templates for common hospitality documents (e.g., registration forms, invoices).
- **Workflow Rules**: Defines rules and logic associated with each template for use in the Workflow Service.

## 3. API Endpoints

- `GET /api/templates`: Retrieve a list of all available templates.
- `POST /api/templates`: Create a new template.
- `GET /api/templates/{id}`: Get details for a specific template.
- `PUT /api/templates/{id}`: Update a template.

_(Note: A detailed OpenAPI specification is available at the service's `/docs` endpoint.)_

## 4. Database Schema

- **Database**: Supabase (PostgreSQL)
- **Key Tables**:
  - `templates`: Stores the content and metadata for each document template.
  - `template_rules`: Defines the workflow rules associated with each template.

## 5. Configuration

| Environment Variable | Description                            | Example                          |
| -------------------- | -------------------------------------- | -------------------------------- |
| `DATABASE_URL`       | Connection string for the Supabase DB. | `postgresql://user:pass@host/db` |
