# Auth Service

**Status: Implemented (Production Ready)**

## 1. Overview

The Auth Service is a comprehensive service responsible for user authentication, authorization, and management for the Buffr Host platform. It is built with FastAPI and uses Supabase for its database.

## 2. Features

-   **User Registration**: Creates new users with hashed passwords.
-   **Authentication**: Verifies user credentials and issues JWT access and refresh tokens.
-   **Token Management**: Includes endpoints for refreshing access tokens.
-   **Password Management**: Provides secure password hashing, verification, and a forgot/reset password flow.
-   **User Management**: Endpoints for retrieving and updating user profiles.
-   **Role-Based Access Control (RBAC)**: Includes a dependency to require specific roles for endpoint access, with a defined role hierarchy.
-   **Admin-Level User Management**: Endpoints for listing, activating, deactivating, and updating the roles of users.

## 3. API Endpoints

*   `POST /register`: Register a new user.
*   `POST /login`: Authenticate a user and receive JWT tokens.
*   `POST /refresh`: Refresh an expired access token.
*   `GET /me`: Get the current user's information.
*   `PUT /me`: Update the current user's information.
*   `POST /change-password`: Change the current user's password.
*   `POST /forgot-password`: Initiate the password reset process.
*   `POST /reset-password`: Complete the password reset process.
*   `GET /users`: (Admin/Manager) List all users.
*   `GET /users/{user_id}`: (Admin/Manager) Get a specific user by ID.
*   `PUT /users/{user_id}/role`: (Admin) Update a user's role.
*   `PUT /users/{user_id}/activate`: (Admin) Activate a user account.
*   `PUT /users/{user_id}/deactivate`: (Admin) Deactivate a user account.
*   `POST /logout`: Log a user out.
*   `GET /health`: Health check endpoint.

*(Note: A detailed OpenAPI specification is available at the service's `/docs` endpoint when running.)*

## 4. Database Schema

-   **Database**: Supabase (PostgreSQL)
-   **Key Tables**:
    -   `users`: Stores core user information, hashed passwords, roles, and profile data.
    -   `password_reset_tokens`: Stores tokens for the password reset flow.

## 5. Key Dependencies

-   `fastapi`: Web framework
-   `supabase`: Database client
-   `pyjwt`: JSON Web Token implementation
-   `bcrypt`: Password hashing
-   `pydantic`: Data validation

