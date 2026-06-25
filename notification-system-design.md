# Notification System Design

# Stage 1

## Overview

The notification service allows students to receive important updates such as placement drives, exam results and college events.

The system provides REST APIs for:

- Create Notification
- Get Notifications
- Get Unread Notifications
- Mark Notification as Read
- Mark All Notifications as Read
- Delete Notification

Authentication is performed using Bearer JWT Token.

---

## Base URL

```
/api/v1
```

Headers

```
Authorization: Bearer <token>
Content-Type: application/json
```

---

## 1. Create Notification

POST

```
/notifications
```

Request

```json
{
  "studentId": 1042,
  "notificationType": "Placement",
  "title": "CSX Hiring",
  "message": "CSX Corporation hiring drive starts tomorrow",
  "priority": "HIGH"
}
```

Response

```json
{
  "success": true,
  "notificationId": "NTF12345"
}
```

---

## 2. Get All Notifications

GET

```
/notifications
```

Query Parameters

```
?page=1
&limit=20
```

Response

```json
{
  "success": true,
  "notifications": [
    {
      "id":"NTF123",
      "type":"Placement",
      "title":"CSX Hiring",
      "message":"Drive starts tomorrow",
      "isRead":false,
      "createdAt":"2026-04-22T10:00:00Z"
    }
  ]
}
```

---

## 3. Get Unread Notifications

GET

```
/notifications/unread
```

Response

```json
{
  "success": true,
  "count": 5,
  "notifications":[]
}
```

---

## 4. Mark Notification as Read

PUT

```
/notifications/{notificationId}/read
```

Response

```json
{
   "success":true
}
```

---

## 5. Mark All Notifications as Read

PUT

```
/notifications/read-all
```

Response

```json
{
   "success":true
}
```

---

## 6. Delete Notification

DELETE

```
/notifications/{notificationId}
```

Response

```json
{
   "success":true
}
```

---

## Real Time Notification

Real-time notifications will be implemented using WebSockets.

Workflow

1. Student logs into application.
2. WebSocket connection is established.
3. Whenever HR/Admin creates a notification, the backend stores it in the database.
4. The server pushes the notification instantly to all connected students.
5. If a student is offline, the notification remains stored in the database and will be fetched when the student logs in again.

Benefits

- Instant delivery
- Reduced polling
- Better user experience
- Lower server load



# Stage 2

## Database Design

### notifications

| Column | Type | Description |
|---------|------|-------------|
| id | UUID | Primary Key |
| student_id | INT | Student ID |
| notification_type | VARCHAR(50) | Placement / Exam / Event |
| title | VARCHAR(255) | Notification Title |
| message | TEXT | Notification Content |
| priority | VARCHAR(20) | HIGH / MEDIUM / LOW |
| is_read | BOOLEAN | Read Status |
| created_at | TIMESTAMP | Created Time |
| updated_at | TIMESTAMP | Updated Time |

---

## SQL Schema

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    student_id INT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Recommended Indexes

```sql
CREATE INDEX idx_student
ON notifications(student_id);

CREATE INDEX idx_created
ON notifications(created_at DESC);

CREATE INDEX idx_unread
ON notifications(student_id,is_read);
```

---

## Why these indexes?

- student_id → Fast retrieval of a student's notifications.
- created_at → Faster sorting by latest notifications.
- (student_id, is_read) → Optimized unread notification queries.