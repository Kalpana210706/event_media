# Database Schema

Event Media Management System uses MongoDB Atlas with Mongoose models to manage users, events, media, and notifications.

---

# 1. User Collection

Stores registered users and their access roles.

| Field     | Type   | Description        |
| --------- | ------ | ------------------ |
| name      | String | User name          |
| email     | String | Unique email       |
| password  | String | Hashed password    |
| role      | String | admin or member    |
| createdAt | Date   | Creation timestamp |
| updatedAt | Date   | Update timestamp   |

### Roles

* admin
* member

---

# 2. Event Collection

Stores event information.

| Field       | Type            | Description             |
| ----------- | --------------- | ----------------------- |
| title       | String          | Event title             |
| slug        | String          | URL-friendly identifier |
| description | String          | Event description       |
| category    | String          | Event category          |
| date        | Date            | Event date              |
| coverImage  | String          | Event cover image       |
| createdBy   | ObjectId → User | Event creator           |
| createdAt   | Date            | Creation timestamp      |
| updatedAt   | Date            | Update timestamp        |

---

# 3. Media Collection

Stores uploaded media and interaction information.

| Field       | Type              | Description          |
| ----------- | ----------------- | -------------------- |
| imageUrl    | String            | Cloudinary media URL |
| mediaType   | String            | image or video       |
| uploadedBy  | ObjectId → User   | Uploader             |
| event       | ObjectId → Event  | Related event        |
| caption     | String            | Media caption        |
| visibility  | String            | public or private    |
| tags        | String[]          | Media tags           |
| taggedUsers | ObjectId[] → User | Tagged users         |
| likes       | ObjectId[] → User | Users who liked      |
| favourites  | ObjectId[] → User | Users who favourited |
| comments    | Comment[]         | Embedded comments    |
| createdAt   | Date              | Creation timestamp   |
| updatedAt   | Date              | Update timestamp     |

---

## Comment Subdocument

| Field     | Type            | Description        |
| --------- | --------------- | ------------------ |
| user      | ObjectId → User | Comment author     |
| text      | String          | Comment text       |
| createdAt | Date            | Creation timestamp |
| updatedAt | Date            | Update timestamp   |

---

# 4. Notification Collection

Stores interaction notifications.

| Field     | Type             | Description                   |
| --------- | ---------------- | ----------------------------- |
| recipient | ObjectId → User  | Receiver                      |
| sender    | ObjectId → User  | Triggering user               |
| media     | ObjectId → Media | Related media                 |
| type      | String           | like, comment, favourite, tag |
| message   | String           | Notification text             |
| isRead    | Boolean          | Read status                   |
| createdAt | Date             | Creation timestamp            |
| updatedAt | Date             | Update timestamp              |

---

# Relationships

```txt
User 1 ──── * Event

User 1 ──── * Media

Event 1 ──── * Media

User * ──── * Media Likes

User * ──── * Media Favourites

User * ──── * Media Tagged Users

Media 1 ──── * Comments

User 1 ──── * Notifications Received

User 1 ──── * Notifications Sent

Media 1 ──── * Notifications
```

---

# Core Collections

* Users
* Events
* Media
* Notifications

---

# Design Notes

* MongoDB Atlas stores structured platform data.
* Cloudinary stores media files and handles scalable media delivery.
* Media metadata remains inside MongoDB.
* Notifications are stored separately for efficient retrieval.
* Comments are embedded inside media documents for simpler access patterns.
* Role-based access control is implemented using user roles.
* The system supports event-based media organization, search, tagging, favourites, analytics, and facial-recognition-powered photo discovery.
