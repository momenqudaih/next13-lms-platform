# LMS Platform - Core API Endpoints

## API Endpoints Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/courses` | POST | Creates a new course (Instructor only). |
| `/api/courses` | GET | Retrieves all available courses from the database. |
| `/api/courses/:id` | PATCH | Updates or modifies existing course content. |
| `/api/courses/:id` | DELETE | Deletes a course and cleans up associated Mux videos. |
| `/api/courses/:id/publish` | PATCH | Publishes a course making it available to students. |
| `/api/courses/:id/unpublish` | PATCH | Unpublishes a course hiding it from students. |
| `/api/courses/:id/checkout` | POST | Processes course purchases securely via Stripe. |
| `/api/courses/:id/attachments` | POST | Uploads course attachments and files. |
| `/api/courses/:id/attachments/:id` | DELETE | Removes specific course attachments. |
| `/api/courses/:id/chapters` | POST | Creates new chapters within a course. |
| `/api/courses/:id/chapters/reorder` | PUT | Reorders chapters within a course. |
| `/api/chapters/:id` | PATCH | Updates chapter content including video uploads. |
| `/api/chapters/:id` | DELETE | Deletes a chapter and associated Mux video data. |
| `/api/chapters/:id/publish` | PATCH | Publishes a chapter making it accessible. |
| `/api/chapters/:id/unpublish` | PATCH | Unpublishes a chapter hiding it from students. |
| `/api/chapters/:id/progress` | PUT | Updates student progress for a specific chapter. |
| `/api/uploadthing` | GET/POST | Handles file uploads via UploadThing service. |
| `/api/webhook` | POST | Processes Stripe webhook events for payments. |

## Key Features

- **Authentication**: All endpoints use Clerk authentication
- **Authorization**: Course ownership validation for instructor actions  
- **Video Processing**: Mux integration for video content management
- **Payment Processing**: Stripe integration for course purchases
- **File Management**: UploadThing for file uploads and attachments
- **Progress Tracking**: Student progress monitoring system

## Technical Notes

The API follows RESTful conventions and includes:
- Proper error handling
- Authentication checks
- Database cleanup operations
- Dynamic imports for build optimization
- Force dynamic routing configuration

---
*Generated from Next.js 13 LMS Platform*
