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