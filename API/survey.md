# Survey API Documentation

## Overview

The Survey API allows administrators to create and manage surveys for mentors, and enables mentors to view and respond to surveys. Administrators can also track survey completion and responses.

## Authentication

All endpoints require authentication and appropriate role authorization:

- **ADMIN**: Can create, manage, and track surveys
- **MENTOR**: Can view available surveys and submit responses

## Admin Endpoints

### Create Survey

**POST** `/api/admin/survey`

Creates a new survey for mentors.

**Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Monthly Mentor Feedback Survey",
  "description": "Please provide your feedback on the mentoring experience this month",
  "questions": [
    {
      "id": "q1",
      "text": "How satisfied are you with the mentoring platform?",
      "type": "rating",
      "required": true,
      "options": ["1", "2", "3", "4", "5"]
    },
    {
      "id": "q2",
      "text": "What challenges did you face this month?",
      "type": "textarea",
      "required": true
    },
    {
      "id": "q3",
      "text": "Which area needs improvement?",
      "type": "multiple_choice",
      "required": false,
      "options": ["Platform UI", "Communication", "Payment", "Support"]
    }
  ],
  "deadline": "2024-02-28T23:59:59.000Z"
}
```

**Question Types:**

- `text`: Short text input
- `textarea`: Long text input
- `multiple_choice`: Single selection from options
- `rating`: Rating scale (requires options array)

**Response:**

```json
{
  "code": 201,
  "error": false,
  "data": {
    "ID": "survey-uuid",
    "title": "Monthly Mentor Feedback Survey",
    "description": "Please provide your feedback...",
    "questions": [...],
    "status": "ACTIVE",
    "createdBy": "admin@example.com",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "deadline": "2024-02-28T23:59:59.000Z"
  },
  "message": "Survey created successfully"
}
```

### Get All Surveys

**GET** `/api/admin/surveys`

Retrieves all surveys created by administrators.

**Response:**

```json
{
  "code": 200,
  "error": false,
  "data": [
    {
      "ID": "survey-uuid",
      "title": "Monthly Mentor Feedback Survey",
      "status": "ACTIVE",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "deadline": "2024-02-28T23:59:59.000Z"
    }
  ],
  "message": "Surveys retrieved successfully"
}
```

### Get Survey by ID

**GET** `/api/admin/survey/:id`

Retrieves detailed information about a specific survey.

**Response:**

```json
{
  "code": 200,
  "error": false,
  "data": {
    "ID": "survey-uuid",
    "title": "Monthly Mentor Feedback Survey",
    "description": "Please provide your feedback...",
    "questions": [...],
    "status": "ACTIVE",
    "createdBy": "admin@example.com",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "deadline": "2024-02-28T23:59:59.000Z"
  },
  "message": "Survey retrieved successfully"
}
```

### Get Survey Tracking

**GET** `/api/admin/survey/tracking/:surveyId`

Retrieves detailed tracking information for a specific survey.

**Response:**

```json
{
  "code": 200,
  "error": false,
  "data": {
    "survey": {
      "id": "survey-uuid",
      "title": "Monthly Mentor Feedback Survey",
      "status": "ACTIVE",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "deadline": "2024-02-28T23:59:59.000Z"
    },
    "statistics": {
      "totalMentors": 50,
      "totalResponses": 35,
      "notRespondedCount": 15,
      "responseRate": "70.00%"
    },
    "respondedMentors": [
      {
        "email": "mentor1@example.com",
        "fullName": "John Doe",
        "submittedAt": "2024-01-16T14:30:00.000Z",
        "responseId": "response-uuid",
        "mentorStatus": "ACCEPTED"
      }
    ],
    "notRespondedMentors": [
      {
        "email": "mentor2@example.com",
        "fullName": "Jane Smith",
        "mentorStatus": "ACCEPTED"
      }
    ]
  },
  "message": "Survey tracking data retrieved successfully"
}
```

### Get All Survey Tracking

**GET** `/api/admin/surveys/tracking`

Retrieves tracking overview for all surveys.

**Response:**

```json
{
  "code": 200,
  "error": false,
  "data": [
    {
      "surveyId": "survey-uuid",
      "title": "Monthly Mentor Feedback Survey",
      "status": "ACTIVE",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "deadline": "2024-02-28T23:59:59.000Z",
      "totalResponses": 35,
      "totalMentors": 50,
      "responseRate": "70.00%"
    }
  ],
  "message": "All survey tracking data retrieved successfully"
}
```

### Update Survey

**PUT** `/api/admin/survey/:id`

Updates an existing survey.

**Request Body:**

```json
{
  "title": "Updated Survey Title",
  "description": "Updated description",
  "status": "INACTIVE",
  "deadline": "2024-03-31T23:59:59.000Z"
}
```

**Response:**

```json
{
  "code": 200,
  "error": false,
  "data": {
    "ID": "survey-uuid",
    "title": "Updated Survey Title"
    // ... updated survey data
  },
  "message": "Survey updated successfully"
}
```

### Delete Survey

**DELETE** `/api/admin/survey/:id`

Deletes a survey.

**Response:**

```json
{
  "code": 200,
  "error": false,
  "data": null,
  "message": "Survey deleted successfully"
}
```

## Mentor Endpoints

### Get Available Surveys

**GET** `/api/mentor/surveys`

Retrieves surveys available for the mentor to complete.

**Response:**

```json
{
  "code": 200,
  "error": false,
  "data": [
    {
      "id": "survey-uuid",
      "title": "Monthly Mentor Feedback Survey",
      "description": "Please provide your feedback...",
      "questions": [
        {
          "id": "q1",
          "text": "How satisfied are you with the mentoring platform?",
          "type": "rating",
          "required": true,
          "options": ["1", "2", "3", "4", "5"]
        }
      ],
      "createdAt": "2024-01-15T10:00:00.000Z",
      "deadline": "2024-02-28T23:59:59.000Z",
      "createdBy": "admin@example.com"
    }
  ],
  "message": "Available surveys for mentor retrieved successfully"
}
```

### Submit Survey Response

**POST** `/api/mentor/survey/:surveyId/response`

Submits a response to a survey.

**Request Body:**

```json
{
  "responses": [
    {
      "questionId": "q1",
      "answer": "4"
    },
    {
      "questionId": "q2",
      "answer": "The platform is great but could use better mobile support"
    },
    {
      "questionId": "q3",
      "answer": "Platform UI"
    }
  ]
}
```

**Response:**

```json
{
  "code": 201,
  "error": false,
  "data": {
    "ID": "response-uuid",
    "surveyId": "survey-uuid",
    "mentorEmail": "mentor@example.com",
    "responses": [...],
    "status": "COMPLETED",
    "submittedAt": "2024-01-16T14:30:00.000Z"
  },
  "message": "Survey response submitted successfully"
}
```

### Get Mentor Survey Responses

**GET** `/api/mentor/survey/responses`

Retrieves all survey responses submitted by the mentor.

**Response:**

```json
{
  "code": 200,
  "error": false,
  "data": [
    {
      "responseId": "response-uuid",
      "surveyId": "survey-uuid",
      "surveyTitle": "Monthly Mentor Feedback Survey",
      "surveyDescription": "Please provide your feedback...",
      "responses": [...],
      "status": "COMPLETED",
      "submittedAt": "2024-01-16T14:30:00.000Z",
      "surveyCreatedAt": "2024-01-15T10:00:00.000Z",
      "surveyDeadline": "2024-02-28T23:59:59.000Z"
    }
  ],
  "message": "Mentor survey responses retrieved successfully"
}
```

## General Endpoints

### Get Survey Details

**GET** `/api/survey/:id`

Retrieves survey details (accessible by both admin and mentor).

**Response:**

```json
{
  "code": 200,
  "error": false,
  "data": {
    "ID": "survey-uuid",
    "title": "Monthly Mentor Feedback Survey",
    "description": "Please provide your feedback...",
    "questions": [...],
    "status": "ACTIVE",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "deadline": "2024-02-28T23:59:59.000Z"
  },
  "message": "Survey retrieved successfully"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "code": 400,
  "error": true,
  "data": null,
  "message": "Title, description, and questions are required. Questions must be an array."
}
```

### 401 Unauthorized

```json
{
  "code": 401,
  "error": true,
  "data": null,
  "message": "Unauthorized access"
}
```

### 403 Forbidden

```json
{
  "code": 403,
  "error": true,
  "data": null,
  "message": "You have already responded to this survey"
}
```

### 404 Not Found

```json
{
  "code": 404,
  "error": true,
  "data": null,
  "message": "Survey not found"
}
```

### 500 Internal Server Error

```json
{
  "code": 500,
  "error": true,
  "data": null,
  "message": "Internal server error message"
}
```

## Database Collections

### surveys

```json
{
  "ID": "survey-uuid",
  "title": "Survey Title",
  "description": "Survey Description",
  "questions": [
    {
      "id": "q1",
      "text": "Question text",
      "type": "rating|text|textarea|multiple_choice",
      "required": true|false,
      "options": ["option1", "option2"] // for multiple_choice and rating
    }
  ],
  "status": "ACTIVE|INACTIVE",
  "createdBy": "admin@example.com",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "deadline": "2024-02-28T23:59:59.000Z"
}
```

### survey_responses

```json
{
  "ID": "response-uuid",
  "surveyId": "survey-uuid",
  "mentorEmail": "mentor@example.com",
  "responses": [
    {
      "questionId": "q1",
      "answer": "response answer"
    }
  ],
  "status": "COMPLETED|DRAFT",
  "submittedAt": "2024-01-16T14:30:00.000Z"
}
```
