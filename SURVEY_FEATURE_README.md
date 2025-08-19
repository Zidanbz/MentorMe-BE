# Survey Feature for MentorMe Backend

## Overview

This document describes the newly implemented survey feature that allows administrators to create surveys for mentors and track their responses. The feature enables in-app survey functionality where mentors can fill out surveys and administrators can monitor completion rates and responses.

## Features Implemented

### 🔧 Core Functionality

- **Survey Creation**: Administrators can create surveys with multiple question types
- **Survey Management**: Full CRUD operations for surveys
- **Response Collection**: Mentors can submit responses to active surveys
- **Progress Tracking**: Administrators can track survey completion rates
- **Response Analytics**: Detailed tracking of who has responded and who hasn't

### 📊 Question Types Supported

- **Text**: Short text input
- **Textarea**: Long text input
- **Multiple Choice**: Single selection from predefined options
- **Rating**: Rating scale with customizable options

### 🔐 Role-Based Access

- **ADMIN**: Can create, manage, and track all surveys
- **MENTOR**: Can view available surveys and submit responses

## Files Created

### Entities

- `functions/public/javascripts/entity/Survey.js` - Survey data model
- `functions/public/javascripts/entity/SurveyResponse.js` - Survey response data model

### Repository

- `functions/public/javascripts/repo/SurveyRepo.js` - Database operations for surveys and responses

### Services

- `functions/public/javascripts/service/survey/CreateSurveyService.js` - Survey creation logic
- `functions/public/javascripts/service/survey/GetSurveysService.js` - Survey retrieval logic
- `functions/public/javascripts/service/survey/SubmitSurveyResponseService.js` - Response submission logic
- `functions/public/javascripts/service/survey/GetSurveyTrackingService.js` - Tracking and analytics
- `functions/public/javascripts/service/survey/GetMentorSurveyResponsesService.js` - Mentor response management

### Routes

- `functions/routes/SurveyRouter.js` - All survey-related API endpoints

### Documentation

- `API/survey.md` - Complete API documentation with examples
- `functions/test-survey.js` - Test script for basic functionality

### Configuration

- `functions/app.js` - Updated to include survey router

## API Endpoints

### Admin Endpoints

```
POST   /api/admin/survey                    - Create new survey
GET    /api/admin/surveys                   - Get all surveys
GET    /api/admin/survey/:id                - Get survey by ID
PUT    /api/admin/survey/:id                - Update survey
DELETE /api/admin/survey/:id                - Delete survey
GET    /api/admin/survey/tracking/:surveyId - Get survey tracking details
GET    /api/admin/surveys/tracking          - Get all surveys tracking overview
```

### Mentor Endpoints

```
GET    /api/mentor/surveys                  - Get available surveys for mentor
POST   /api/mentor/survey/:surveyId/response - Submit survey response
GET    /api/mentor/survey/responses         - Get mentor's survey responses
```

### General Endpoints

```
GET    /api/survey/:id                      - Get survey details (Admin & Mentor)
```

## Database Collections

### surveys

Stores survey templates created by administrators:

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
      "options": ["option1", "option2"]
    }
  ],
  "status": "ACTIVE|INACTIVE",
  "createdBy": "admin@example.com",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "deadline": "2024-02-28T23:59:59.000Z"
}
```

### survey_responses

Stores mentor responses to surveys:

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

## Usage Examples

### Creating a Survey (Admin)

```bash
curl -X POST http://localhost:3000/api/admin/survey \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Monthly Mentor Feedback",
    "description": "Please provide your monthly feedback",
    "questions": [
      {
        "id": "q1",
        "text": "How satisfied are you with the platform?",
        "type": "rating",
        "required": true,
        "options": ["1", "2", "3", "4", "5"]
      }
    ],
    "deadline": "2024-02-28T23:59:59.000Z"
  }'
```

### Submitting a Response (Mentor)

```bash
curl -X POST http://localhost:3000/api/mentor/survey/{surveyId}/response \
  -H "Authorization: Bearer <mentor-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "responses": [
      {
        "questionId": "q1",
        "answer": "4"
      }
    ]
  }'
```

### Getting Survey Tracking (Admin)

```bash
curl -X GET http://localhost:3000/api/admin/survey/tracking/{surveyId} \
  -H "Authorization: Bearer <admin-token>"
```

## Testing

### Run Basic Tests

```bash
cd functions
node test-survey.js
```

### Start the Server

```bash
npm start
```

### Test with Postman

Import the API endpoints from `API/survey.md` into Postman for comprehensive testing.

## Key Features

### 🔒 Security Features

- Role-based authorization for all endpoints
- Prevents duplicate responses from same mentor
- Validates survey deadlines
- Input validation for all requests

### 📈 Analytics Features

- Response rate calculation
- Mentor participation tracking
- Detailed response analytics
- Export-ready data format

### 🎯 User Experience Features

- Clear error messages
- Consistent API response format
- Support for multiple question types
- Deadline management

## Integration Points

### Existing Systems

- Uses existing authentication system (`AutenticationUtil`)
- Integrates with mentor management system (`MentorRepo`)
- Uses existing user management (`UserRepo`)
- Follows existing API response patterns (`APIResponse`)

### Firebase Integration

- Uses existing Firestore database connection
- Follows existing collection naming conventions
- Uses existing security configurations

## Future Enhancements

### Potential Improvements

- Survey templates for quick creation
- Bulk survey operations
- Advanced analytics dashboard
- Email notifications for survey deadlines
- Survey response export functionality
- Anonymous survey options
- Survey scheduling features

### Scalability Considerations

- Pagination for large survey lists
- Caching for frequently accessed surveys
- Batch operations for bulk responses
- Performance optimization for tracking queries

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Ensure proper Bearer token in Authorization header
2. **Role Permission Errors**: Verify user has correct role (ADMIN/MENTOR)
3. **Survey Not Found**: Check survey ID and ensure survey exists
4. **Duplicate Response**: Mentor has already responded to the survey
5. **Expired Survey**: Survey deadline has passed

### Debug Steps

1. Check server logs for detailed error messages
2. Verify database collections exist in Firestore
3. Test authentication endpoints first
4. Use the test script to verify basic functionality

## Support

For technical support or questions about the survey feature:

1. Check the API documentation in `API/survey.md`
2. Run the test script to verify functionality
3. Review server logs for error details
4. Check Firestore console for data integrity

---

**Status**: ✅ Fully Implemented and Tested
**Version**: 1.0.0
**Last Updated**: January 2024
