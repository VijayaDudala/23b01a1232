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


# Stage 3

## Query Optimization

### 1. Retrieve latest notifications for a student

```sql
SELECT *
FROM notifications
WHERE student_id = ?
ORDER BY created_at DESC
LIMIT 20;
```

Optimization:
- Uses `idx_student`.
- Uses `idx_created`.
- Returns only the latest 20 records.

---

### 2. Retrieve unread notifications

```sql
SELECT *
FROM notifications
WHERE student_id = ?
AND is_read = FALSE;
```

Optimization:
- Uses composite index `(student_id, is_read)`.
- Avoids full table scan.

---

### 3. Mark notification as read

```sql
UPDATE notifications
SET is_read = TRUE,
    updated_at = CURRENT_TIMESTAMP
WHERE id = ?;
```

Optimization:
- Primary Key lookup.
- O(log n) update using primary key index.

---

### 4. Delete notification

```sql
DELETE
FROM notifications
WHERE id = ?;
```

Optimization:
- Uses Primary Key index.
- Deletes only one record.

---

## Performance Improvements

- Use pagination for large datasets.
- Retrieve only required columns instead of `SELECT *`.
- Create indexes on frequently queried columns.
- Archive old notifications to reduce active table size.
- Use prepared statements to improve execution and security.


# Stage 4

## Performance Improvements

### 1. Database Indexing
- Create indexes on `student_id`, `created_at`, and `is_read`.
- Use composite indexes for frequently queried fields.

### 2. Pagination
- Fetch notifications in pages using `LIMIT` and `OFFSET`.
- Prevent loading thousands of records in one request.

### 3. Caching
- Cache frequently accessed notifications using Redis.
- Reduce repeated database queries.

### 4. Asynchronous Processing
- Use a message queue (RabbitMQ/Kafka) for sending notifications.
- Prevent long response times during high traffic.

### 5. Connection Pooling
- Maintain a pool of database connections.
- Reduce connection creation overhead.

### 6. WebSockets
- Deliver notifications instantly without client polling.
- Reduce unnecessary HTTP requests.

### 7. Load Balancing
- Deploy multiple backend instances behind a load balancer.
- Distribute incoming requests evenly.

### 8. Monitoring
- Monitor API latency and server health.
- Log failures and response times for debugging.

---

## Expected Benefits

- Faster notification delivery.
- Lower database load.
- Better scalability for thousands of concurrent users.
- Improved user experience with real-time updates.

# Stage 5

## Problems in Existing Code

- Sequential processing is slow.
- Failure of one email interrupts processing.
- No retry mechanism.
- DB save and email are tightly coupled.
- No status tracking.
- Difficult to scale to 50,000 students.

## Improved Design

- Add all notification jobs to a queue.
- Save notification to DB first.
- Retry email delivery up to 3 times.
- Continue processing remaining students even if one fails.
- Push notification is sent after successful DB save.
- Track success and failure counts.

## Why DB Save and Email Should Not Be Together?

Saving to the database guarantees the notification is persisted.

Email delivery depends on external services and can fail temporarily.

Separating these operations improves reliability and scalability.

## Revised Pseudocode

notifyAll(studentIds, message)

↓

Add every student to Queue

↓

Worker picks one student

↓

Save Notification to DB

↓

Retry Email (3 attempts)

↓

Send Push Notification

↓

Update Status

↓

Process Next Student