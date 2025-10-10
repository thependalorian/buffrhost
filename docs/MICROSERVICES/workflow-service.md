# Workflow Service

**Status: Basic Implementation (Execution Engine Missing)**

## 1. Overview

The Workflow Service is intended to manage and automate business processes based on predefined workflows. The current implementation is basic and lacks a core execution engine.

## 2. Responsibilities

-   **Workflow Definitions**: Provides CRUD operations for creating and managing workflow definitions.
-   **Automation (Placeholder)**: Designed to trigger actions and orchestrate tasks between different microservices. **This is not yet implemented.**

## 3. API Endpoints

*   `GET /api/workflows`: Retrieve a list of all workflow definitions.
*   `POST /api/workflows`: Create a new workflow definition.
*   `GET /api/workflows/{id}`: Get details for a specific workflow.

*(Note: A detailed OpenAPI specification is available at the service's `/docs` endpoint.)*

## 4. Database Schema

-   **Database**: Supabase (PostgreSQL)
-   **Key Tables**:
    -   `workflows`: Stores the definitions for each workflow, including states and transitions.
    -   `workflow_instances`: Intended to track the state of each running workflow instance.

## 5. Configuration

| Environment Variable | Description                             | Example                          |
| -------------------- | --------------------------------------- | -------------------------------- |
| `DATABASE_URL`       | Connection string for the Supabase DB.  | `postgresql://user:pass@host/db` |

