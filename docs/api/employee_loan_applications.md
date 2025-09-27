# BuffrHost API: Employee Loan Applications

## Overview
This API endpoint allows external systems, such as BuffrLend, to submit employee loan applications for processing by BuffrHost. BuffrHost, as the employer, will receive these applications and can initiate an internal review process.

## Endpoint
`POST /employee-loan-applications`

## Authentication
This endpoint requires API Key authentication. Include your BuffrHost API Key in the `Authorization` header as a Bearer token.

`Authorization: Bearer YOUR_BUFFRHOST_API_KEY`

## Request Body
The request body should be a JSON object conforming to the `EmployeeLoanApplication` schema.

### `EmployeeLoanApplication` Schema
| Field                     | Type      | Required | Description                                                              |
|---------------------------|-----------|----------|--------------------------------------------------------------------------|
| `employee_id`             | `string`  | Yes      | Unique identifier for the employee within BuffrHost.                     |
| `property_id`             | `string`  | Yes      | The ID of the hospitality property the employee belongs to.              |
| `requested_amount`        | `number`  | Yes      | The loan amount requested by the employee.                               |
| `loan_purpose`            | `string`  | Yes      | The stated purpose of the loan (e.g., "emergency", "education").       |
| `employment_start_date`   | `string`  | Yes      | The employee's start date of employment (YYYY-MM-DD format).             |
| `salary`                  | `number`  | Yes      | The employee's current gross monthly salary.                             |
| `contact_email`           | `string`  | Yes      | The employee's contact email address.                                    |
| `contact_phone`           | `string`  | No       | The employee's contact phone number.                                     |

## Response

### Success Response (HTTP 200 OK)
```json
{
  "message": "Employee loan application received successfully",
  "application_id": "app-emp123-uuid-goes-here",
  "employee_id": "emp123",
  "status": "received",
  "received_at": "2025-09-24T10:30:00.123456"
}
```

### Error Response (HTTP 4xx/5xx)
```json
{
  "detail": "Error message describing the issue."
}
```

## Example Request
```bash
curl -X POST \
  https://host.buffr.ai/employee-loan-applications \
  -H "Authorization: Bearer YOUR_BUFFRHOST_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ 
    "employee_id": "emp123",
    "property_id": "prop-456",
    "requested_amount": 5000.00,
    "loan_purpose": "medical_emergency",
    "employment_start_date": "2020-01-15",
    "salary": 15000.00,
    "contact_email": "employee@example.com",
    "contact_phone": "+264811234567"
  }'
```
