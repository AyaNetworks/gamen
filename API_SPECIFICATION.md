# Dione Workspace API Specification

**Version:** 1.0.0
**Last Updated:** 2025-10-26
**Status:** Ready for Implementation

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [Core Data Models](#core-data-models)
4. [API Endpoints](#api-endpoints)
5. [WebSocket Events](#websocket-events)
6. [Error Handling](#error-handling)
7. [Implementation Notes](#implementation-notes)

---

## Overview

### API Architecture

- **Base URL:** `http://localhost:8000/api/v1`
- **Protocol:** REST with JSON request/response bodies
- **Real-time:** WebSocket support for chat streaming and live updates
- **Authentication:** JWT tokens (Bearer scheme)
- **Rate Limiting:** TBD (recommended: 1000 req/min per user)
- **CORS:** Enable for frontend origin (http://localhost:5173 for dev)

### Architecture Flow

```
Client (React)
    ↓
API Gateway (FastAPI middleware)
    ↓
Route Handlers
    ↓
Business Logic Layer
    ↓
Database (SQLAlchemy ORM)
    ↓
Persistent Storage (PostgreSQL)
```

### Key Principles

1. **RESTful Design** - Standard HTTP methods and status codes
2. **Idempotent Operations** - Safe to retry without side effects
3. **Pagination** - All list endpoints support limit/offset
4. **Versioning** - `/api/v1` prefix for future compatibility
5. **Soft Deletes** - Delete operations mark records as inactive, not removed
6. **Timestamps** - All entities track `createdAt` and `updatedAt`
7. **Validation** - Input validation with 400 Bad Request errors

---

## Authentication & Authorization

### JWT Token Flow

```
1. POST /api/v1/auth/login
   Request: { email, password }
   Response: { accessToken, refreshToken, user }

2. Request with Token:
   Header: Authorization: Bearer {accessToken}

3. Token Refresh:
   POST /api/v1/auth/refresh
   Body: { refreshToken }
   Response: { accessToken, refreshToken }
```

### Token Details

- **Access Token:** 1 hour expiry (JWT with RS256 signing)
- **Refresh Token:** 30 days expiry (stored in secure httpOnly cookie)
- **Token Claims:** `{sub: userId, email, role, iat, exp}`

### Authorization Scopes

```
- read:chats          - Read user's chat sessions
- write:chats         - Create/edit user's chats
- read:tasks          - Read user's tasks
- write:tasks         - Create/edit user's tasks
- read:artifacts      - Read user's artifacts
- write:artifacts     - Publish artifacts
- admin:users         - Manage user accounts
- admin:workspace     - Manage workspace settings
```

### Endpoints

#### `POST /api/v1/auth/login`

Sign in with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_string",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "displayName": "John Doe",
    "theme": "dark",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid credentials
- `429 Too Many Requests` - Too many login attempts

---

#### `POST /api/v1/auth/signup`

Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "displayName": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "email": "user@example.com",
  "displayName": "John Doe",
  "theme": "dark",
  "createdAt": "2025-01-01T00:00:00Z"
}
```

**Error Responses:**
- `400 Bad Request` - Validation errors or email already exists
- `422 Unprocessable Entity` - Invalid email format

---

#### `POST /api/v1/auth/logout`

Invalidate current session.

**Request:**
```json
{
  "refreshToken": "token_to_invalidate"
}
```

**Response:** `200 OK`
```json
{
  "message": "Logout successful"
}
```

---

#### `POST /api/v1/auth/refresh`

Refresh access token using refresh token.

**Request:**
```json
{
  "refreshToken": "refresh_token_string"
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "new_jwt_token",
  "refreshToken": "new_refresh_token"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or expired refresh token

---

## Core Data Models

### ChatSession

```typescript
{
  id: number                    // Auto-incremented
  userId: number                // Owner
  title: string                 // Default: "New Chat"
  projectId?: number            // Links to project
  messages: Message[]           // Lazy-loaded
  createdAt: string            // ISO 8601
  updatedAt: string
  archivedAt?: string          // Null if active, timestamp if archived
}
```

### Message

```typescript
{
  id: number
  chatId: number
  role: 'user' | 'ai'          // Assistant role
  content: string              // Markdown supported
  type: 'dione' | 'claude'     // AI source
  status: 'success' | 'error' | 'pending'
  tokens?: {
    input: number
    output: number
  }
  replyingTo?: number          // Message ID this replies to
  attachments: Attachment[]    // Lazy-loaded
  metadata?: {
    traceId?: string
    model?: string
    [key: string]: any
  }
  createdAt: string
  updatedAt: string
}
```

### Attachment

```typescript
{
  id: number
  messageId: number
  type: 'document' | 'artifact' | 'workspace' | 'code'
  referenceId: number          // ID of linked resource
  metadata?: {
    fileName: string
    filePath: string
    size?: number
    [key: string]: any
  }
  createdAt: string
}
```

### Project

```typescript
{
  id: number
  userId: number
  name: string
  description?: string
  chats: ChatSession[]         // Lazy-loaded
  tasks: Task[]                // Lazy-loaded
  settings?: {
    autoArchive: boolean
    [key: string]: any
  }
  createdAt: string
  updatedAt: string
  archivedAt?: string
}
```

### Task

```typescript
{
  id: number
  userId: number
  projectId?: number           // Null for global tasks
  title: string
  description?: string
  priority: 'high' | 'medium' | 'low'
  status: 'not_started' | 'in_progress' | 'completed'
  scope: 'project' | 'global'  // Read-only, derived from projectId
  assignee?: {
    id: number
    displayName: string
  }
  tags: string[]
  dueDate?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
  archivedAt?: string
}
```

### Document

```typescript
{
  id: number
  userId: number
  name: string
  type: 'document'
  content: string              // File content
  filePath: string             // S3/storage path
  fileType: string             // pdf, docx, txt, etc.
  size: number                 // Bytes
  tags: {
    source?: string
    uploadedAt?: string
    [key: string]: any
  }
  createdAt: string
  updatedAt: string
}
```

### Library (Uploaded File)

```typescript
{
  id: number
  userId: number
  name: string
  type: 'library'
  content?: string             // For text files
  filePath: string             // S3 path
  fileType: string             // pdf, docx, etc.
  size: number                 // Bytes
  tags: {
    source: 'chat'
    uploadedAt: string
    [key: string]: any
  }
  createdAt: string
  updatedAt: string
}
```

### Artifact (Scratchpad Tab)

```typescript
{
  id: number
  userId: number
  title: string
  content: string
  fileType: string             // python, javascript, markdown, etc.
  fileName: string
  filePath: string             // S3 path
  history: string[]            // Previous versions
  historyIndex: number         // Current position in history
  published: boolean
  shareToken?: string          // Unique token for sharing
  views: number                // Public view count
  createdAt: string
  updatedAt: string
  publishedAt?: string
}
```

### User

```typescript
{
  id: number
  email: string               // Unique
  displayName: string
  theme: 'dark' | 'light'
  preferences?: {
    language: string
    timezone: string
    [key: string]: any
  }
  role: 'user' | 'admin'      // Default: user
  createdAt: string
  updatedAt: string
}
```

### Workspace

```typescript
{
  id: string                   // UUID
  userId: number
  name: string
  path: string                 // Workspace directory path
  type: 'folder' | 'file'
  attached: boolean            // Currently attached to a chat
  attachedAt?: string
}
```

---

## API Endpoints

### Chat Management

#### `GET /api/v1/chats`

List all chat sessions for current user.

**Query Parameters:**
- `projectId?` (number) - Filter by project
- `limit?` (number, default: 20) - Items per page
- `offset?` (number, default: 0) - Pagination offset
- `includeArchived?` (boolean, default: false)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "title": "Project Alpha Discussion",
      "projectId": 5,
      "messageCount": 42,
      "lastMessage": "That sounds great!",
      "lastMessageAt": "2025-10-26T15:30:00Z",
      "createdAt": "2025-10-20T10:00:00Z",
      "updatedAt": "2025-10-26T15:30:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

---

#### `POST /api/v1/chats`

Create a new chat session.

**Request:**
```json
{
  "title": "New Chat",
  "projectId": 5
}
```

**Response:** `201 Created`
```json
{
  "id": 50,
  "title": "New Chat",
  "projectId": 5,
  "messages": [],
  "createdAt": "2025-10-26T15:30:00Z",
  "updatedAt": "2025-10-26T15:30:00Z"
}
```

---

#### `GET /api/v1/chats/{chatId}`

Get a specific chat session with all messages.

**Query Parameters:**
- `includeAttachments?` (boolean, default: true)

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Project Alpha Discussion",
  "projectId": 5,
  "messages": [
    {
      "id": 101,
      "role": "user",
      "content": "What's the timeline?",
      "type": "dione",
      "status": "success",
      "attachments": [],
      "createdAt": "2025-10-26T10:00:00Z"
    },
    {
      "id": 102,
      "role": "ai",
      "content": "Based on the project plan...",
      "type": "dione",
      "status": "success",
      "createdAt": "2025-10-26T10:05:00Z"
    }
  ],
  "createdAt": "2025-10-20T10:00:00Z",
  "updatedAt": "2025-10-26T15:30:00Z"
}
```

---

#### `PUT /api/v1/chats/{chatId}`

Update chat title or project association.

**Request:**
```json
{
  "title": "Updated Title",
  "projectId": 3
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Updated Title",
  "projectId": 3,
  "updatedAt": "2025-10-26T15:35:00Z"
}
```

---

#### `DELETE /api/v1/chats/{chatId}`

Archive a chat session (soft delete).

**Response:** `200 OK`
```json
{
  "id": 1,
  "message": "Chat archived successfully",
  "archivedAt": "2025-10-26T15:35:00Z"
}
```

---

### Messages

#### `POST /api/v1/chats/{chatId}/messages`

Send a message to a chat. This endpoint streams the AI response via Server-Sent Events.

**Request:**
```json
{
  "content": "What's the next step?",
  "type": "dione",
  "attachments": [
    {
      "type": "artifact",
      "referenceId": 10
    },
    {
      "type": "document",
      "referenceId": 3
    }
  ],
  "replyingTo": 95
}
```

**Response:** `201 Created` (initial response)
```json
{
  "id": 103,
  "role": "user",
  "content": "What's the next step?",
  "status": "success",
  "createdAt": "2025-10-26T15:40:00Z"
}
```

**Streaming Response (Server-Sent Events):**
```
event: message_start
data: {"id": 104, "role": "ai", "type": "dione", "model": "claude-3.5"}

event: content_block_delta
data: {"delta": {"type": "text_delta", "text": "Based on"}}

event: content_block_delta
data: {"delta": {"type": "text_delta", "text": " the timeline"}}

event: message_stop
data: {"id": 104, "tokens": {"input": 150, "output": 45}}
```

---

#### `GET /api/v1/chats/{chatId}/messages`

List messages in a chat with pagination.

**Query Parameters:**
- `limit?` (number, default: 50)
- `offset?` (number, default: 0)
- `before?` (ISO timestamp) - Messages before this timestamp
- `after?` (ISO timestamp) - Messages after this timestamp

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 101,
      "chatId": 1,
      "role": "user",
      "content": "What's the timeline?",
      "type": "dione",
      "status": "success",
      "attachments": [
        {
          "id": 201,
          "type": "document",
          "referenceId": 3,
          "metadata": {
            "fileName": "plan.pdf",
            "size": 245000
          }
        }
      ],
      "createdAt": "2025-10-26T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 42,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

---

#### `DELETE /api/v1/messages/{messageId}`

Delete a message from history.

**Response:** `200 OK`
```json
{
  "id": 101,
  "message": "Message deleted successfully"
}
```

---

### Projects

#### `GET /api/v1/projects`

List all projects for current user.

**Query Parameters:**
- `limit?` (number, default: 20)
- `offset?` (number, default: 0)
- `includeArchived?` (boolean, default: false)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 5,
      "name": "Project Alpha",
      "description": "Main product development",
      "chatCount": 3,
      "taskCount": 12,
      "createdAt": "2025-10-01T00:00:00Z",
      "updatedAt": "2025-10-26T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 8,
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}
```

---

#### `POST /api/v1/projects`

Create a new project.

**Request:**
```json
{
  "name": "New Project",
  "description": "Project description"
}
```

**Response:** `201 Created`
```json
{
  "id": 50,
  "name": "New Project",
  "description": "Project description",
  "createdAt": "2025-10-26T15:45:00Z",
  "updatedAt": "2025-10-26T15:45:00Z"
}
```

---

#### `GET /api/v1/projects/{projectId}`

Get project details with associated chats and tasks.

**Response:** `200 OK`
```json
{
  "id": 5,
  "name": "Project Alpha",
  "description": "Main product development",
  "chats": [
    {
      "id": 1,
      "title": "Project Alpha Discussion",
      "messageCount": 42,
      "lastMessageAt": "2025-10-26T15:30:00Z"
    }
  ],
  "tasks": [
    {
      "id": 201,
      "title": "Design API",
      "priority": "high",
      "status": "in_progress",
      "completedAt": null
    }
  ],
  "createdAt": "2025-10-01T00:00:00Z",
  "updatedAt": "2025-10-26T12:00:00Z"
}
```

---

#### `PUT /api/v1/projects/{projectId}`

Update project details.

**Request:**
```json
{
  "name": "Renamed Project",
  "description": "Updated description"
}
```

**Response:** `200 OK`
```json
{
  "id": 5,
  "name": "Renamed Project",
  "description": "Updated description",
  "updatedAt": "2025-10-26T15:50:00Z"
}
```

---

#### `DELETE /api/v1/projects/{projectId}`

Archive a project.

**Response:** `200 OK`
```json
{
  "id": 5,
  "message": "Project archived successfully"
}
```

---

### Tasks

#### `GET /api/v1/tasks`

List tasks with filtering and sorting.

**Query Parameters:**
- `projectId?` (number) - Filter by project
- `status?` (string) - Filter by status: not_started, in_progress, completed
- `priority?` (string) - Filter by priority: high, medium, low
- `scope?` (string) - Filter by scope: project, global
- `limit?` (number, default: 50)
- `offset?` (number, default: 0)
- `sortBy?` (string, default: "createdAt") - Field to sort by
- `sortOrder?` (string, default: "desc") - asc or desc

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 201,
      "title": "Design API",
      "description": "Create RESTful API specification",
      "priority": "high",
      "status": "in_progress",
      "scope": "project",
      "projectId": 5,
      "dueDate": "2025-11-01T00:00:00Z",
      "tags": ["backend", "api"],
      "createdAt": "2025-10-01T00:00:00Z",
      "updatedAt": "2025-10-26T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

---

#### `POST /api/v1/tasks`

Create a new task.

**Request:**
```json
{
  "title": "Implement API",
  "description": "Build FastAPI backend",
  "priority": "high",
  "projectId": 5,
  "dueDate": "2025-11-15T00:00:00Z",
  "tags": ["backend", "api"]
}
```

**Response:** `201 Created`
```json
{
  "id": 250,
  "title": "Implement API",
  "description": "Build FastAPI backend",
  "priority": "high",
  "status": "not_started",
  "projectId": 5,
  "dueDate": "2025-11-15T00:00:00Z",
  "tags": ["backend", "api"],
  "createdAt": "2025-10-26T15:55:00Z",
  "updatedAt": "2025-10-26T15:55:00Z"
}
```

---

#### `GET /api/v1/tasks/{taskId}`

Get task details.

**Response:** `200 OK`
```json
{
  "id": 201,
  "title": "Design API",
  "description": "Create RESTful API specification",
  "priority": "high",
  "status": "in_progress",
  "scope": "project",
  "projectId": 5,
  "assignee": {
    "id": 1,
    "displayName": "John Doe"
  },
  "dueDate": "2025-11-01T00:00:00Z",
  "tags": ["backend", "api"],
  "createdAt": "2025-10-01T00:00:00Z",
  "updatedAt": "2025-10-26T10:00:00Z",
  "completedAt": null
}
```

---

#### `PUT /api/v1/tasks/{taskId}`

Update task.

**Request:**
```json
{
  "status": "completed",
  "priority": "medium",
  "description": "Updated description"
}
```

**Response:** `200 OK`
```json
{
  "id": 201,
  "title": "Design API",
  "status": "completed",
  "priority": "medium",
  "completedAt": "2025-10-26T16:00:00Z",
  "updatedAt": "2025-10-26T16:00:00Z"
}
```

---

#### `DELETE /api/v1/tasks/{taskId}`

Archive a task.

**Response:** `200 OK`
```json
{
  "id": 201,
  "message": "Task archived successfully"
}
```

---

### Files & Documents

#### `POST /api/v1/libraries`

Upload a file to the library.

**Request:** `multipart/form-data`
```
file: <binary file>
tags: {"source": "chat", "category": "research"}
```

**Response:** `201 Created`
```json
{
  "id": 7,
  "name": "research-paper.pdf",
  "type": "library",
  "fileType": "pdf",
  "size": 2048000,
  "filePath": "s3://bucket/libraries/user1/research-paper.pdf",
  "tags": {
    "source": "chat",
    "category": "research",
    "uploadedAt": "2025-10-26T16:05:00Z"
  },
  "createdAt": "2025-10-26T16:05:00Z"
}
```

---

#### `GET /api/v1/libraries`

List uploaded library files.

**Query Parameters:**
- `fileType?` (string) - Filter by file type: pdf, docx, txt, etc.
- `limit?` (number, default: 20)
- `offset?` (number, default: 0)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 7,
      "name": "research-paper.pdf",
      "type": "library",
      "fileType": "pdf",
      "size": 2048000,
      "filePath": "s3://bucket/libraries/user1/research-paper.pdf",
      "createdAt": "2025-10-26T16:05:00Z"
    }
  ],
  "pagination": {
    "total": 12,
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}
```

---

#### `GET /api/v1/libraries/{libraryId}`

Get library file details and signed download URL.

**Response:** `200 OK`
```json
{
  "id": 7,
  "name": "research-paper.pdf",
  "type": "library",
  "fileType": "pdf",
  "size": 2048000,
  "filePath": "s3://bucket/libraries/user1/research-paper.pdf",
  "downloadUrl": "https://s3.amazonaws.com/signed-url-valid-for-1-hour",
  "createdAt": "2025-10-26T16:05:00Z"
}
```

---

#### `DELETE /api/v1/libraries/{libraryId}`

Delete a library file.

**Response:** `200 OK`
```json
{
  "id": 7,
  "message": "Library file deleted successfully"
}
```

---

#### `GET /api/v1/documents`

List documents.

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "name": "API Design Notes",
      "type": "document",
      "fileType": "markdown",
      "size": 15000,
      "createdAt": "2025-10-20T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 3,
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}
```

---

### Artifacts (Scratchpad)

#### `GET /api/v1/artifacts`

List user's artifacts (scratchpad tabs).

**Query Parameters:**
- `published?` (boolean) - Filter by published status
- `limit?` (number, default: 20)
- `offset?` (number, default: 0)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": 1,
      "title": "Python Script",
      "fileType": "python",
      "fileName": "script.py",
      "published": true,
      "views": 42,
      "shareToken": "abc123def456",
      "createdAt": "2025-10-20T00:00:00Z",
      "publishedAt": "2025-10-26T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 8,
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}
```

---

#### `POST /api/v1/artifacts`

Create a new artifact.

**Request:**
```json
{
  "title": "Analysis Script",
  "content": "import pandas as pd\n...",
  "fileType": "python",
  "fileName": "analysis.py"
}
```

**Response:** `201 Created`
```json
{
  "id": 10,
  "title": "Analysis Script",
  "fileType": "python",
  "fileName": "analysis.py",
  "content": "import pandas as pd\n...",
  "published": false,
  "createdAt": "2025-10-26T16:10:00Z"
}
```

---

#### `GET /api/v1/artifacts/{artifactId}`

Get artifact details with content.

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Python Script",
  "fileType": "python",
  "fileName": "script.py",
  "content": "#!/usr/bin/env python3\n...",
  "history": ["version1_content", "version2_content"],
  "historyIndex": 1,
  "published": true,
  "views": 42,
  "shareToken": "abc123def456",
  "createdAt": "2025-10-20T00:00:00Z",
  "publishedAt": "2025-10-26T00:00:00Z"
}
```

---

#### `PUT /api/v1/artifacts/{artifactId}`

Update artifact content or metadata.

**Request:**
```json
{
  "content": "Updated content...",
  "title": "Updated Title"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Updated Title",
  "content": "Updated content...",
  "updatedAt": "2025-10-26T16:15:00Z"
}
```

---

#### `POST /api/v1/artifacts/{artifactId}/publish`

Publish an artifact and generate share link.

**Request:**
```json
{
  "publish": true
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "published": true,
  "shareToken": "abc123def456",
  "shareUrl": "https://dione.app/share/1/abc123def456",
  "publishedAt": "2025-10-26T16:20:00Z"
}
```

---

#### `GET /api/v1/share/{shareToken}`

Get public artifact (no auth required).

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Python Script",
  "fileType": "python",
  "content": "#!/usr/bin/env python3\n...",
  "author": "John Doe",
  "views": 43,
  "publishedAt": "2025-10-26T16:20:00Z"
}
```

**Error Response:**
- `404 Not Found` - Invalid or expired share token

---

#### `DELETE /api/v1/artifacts/{artifactId}`

Delete an artifact.

**Response:** `200 OK`
```json
{
  "id": 1,
  "message": "Artifact deleted successfully"
}
```

---

### User Settings

#### `GET /api/v1/users/me`

Get current user profile.

**Response:** `200 OK`
```json
{
  "id": 1,
  "email": "user@example.com",
  "displayName": "John Doe",
  "theme": "dark",
  "preferences": {
    "language": "en",
    "timezone": "UTC"
  },
  "createdAt": "2025-01-01T00:00:00Z",
  "updatedAt": "2025-10-26T00:00:00Z"
}
```

---

#### `PUT /api/v1/users/me`

Update user profile.

**Request:**
```json
{
  "displayName": "Jane Doe",
  "theme": "light",
  "preferences": {
    "language": "ja",
    "timezone": "Asia/Tokyo"
  }
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "displayName": "Jane Doe",
  "theme": "light",
  "preferences": {
    "language": "ja",
    "timezone": "Asia/Tokyo"
  },
  "updatedAt": "2025-10-26T16:25:00Z"
}
```

---

#### `POST /api/v1/users/me/password`

Change password.

**Request:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_secure_password"
}
```

**Response:** `200 OK`
```json
{
  "message": "Password changed successfully"
}
```

**Error Responses:**
- `401 Unauthorized` - Current password incorrect
- `400 Bad Request` - Password too weak

---

## WebSocket Events

### Connection

```javascript
// Client connects
const ws = new WebSocket('ws://localhost:8000/api/v1/ws?token=jwt_token');

// Server responds
ws.onopen = () => {
  console.log('Connected to WebSocket');
};
```

### Chat Events

#### `chat:message_stream`

Real-time message streaming (same as POST /messages but via WebSocket).

**Client sends:**
```json
{
  "type": "chat:message_stream",
  "chatId": 1,
  "content": "What's the status?",
  "attachments": []
}
```

**Server sends (multiple events):**
```json
{
  "type": "chat:message_start",
  "messageId": 104,
  "role": "ai"
}
```

```json
{
  "type": "chat:message_delta",
  "messageId": 104,
  "text": "Based on the latest"
}
```

```json
{
  "type": "chat:message_complete",
  "messageId": 104,
  "tokens": {"input": 150, "output": 45}
}
```

---

#### `chat:message_created`

Notification of new message (real-time sync across tabs).

**Server sends:**
```json
{
  "type": "chat:message_created",
  "chatId": 1,
  "message": {
    "id": 104,
    "role": "ai",
    "content": "Status update...",
    "createdAt": "2025-10-26T16:30:00Z"
  }
}
```

---

#### `chat:typing`

Typing indicator.

**Client sends:**
```json
{
  "type": "chat:typing",
  "chatId": 1,
  "isTyping": true
}
```

**Server broadcasts to other users:**
```json
{
  "type": "chat:user_typing",
  "chatId": 1,
  "userId": 1,
  "displayName": "John Doe"
}
```

---

### Task Events

#### `task:updated`

Task status or content changed (real-time sync).

**Server sends:**
```json
{
  "type": "task:updated",
  "task": {
    "id": 201,
    "title": "Design API",
    "status": "completed",
    "updatedAt": "2025-10-26T16:35:00Z"
  }
}
```

---

### System Events

#### `connection:ready`

Confirms connection is authenticated.

**Server sends on connect:**
```json
{
  "type": "connection:ready",
  "userId": 1,
  "displayName": "John Doe"
}
```

---

#### `error`

Error event.

**Server sends:**
```json
{
  "type": "error",
  "code": "INVALID_MESSAGE",
  "message": "Unknown message type"
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Chat with ID 999 not found",
    "details": {
      "resourceType": "chat",
      "resourceId": 999
    },
    "timestamp": "2025-10-26T16:40:00Z",
    "requestId": "req-uuid-123"
  }
}
```

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful GET/PUT |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input, validation error |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Authenticated but not authorized for resource |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate email on signup |
| 422 | Unprocessable Entity | Semantic error (invalid email format) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |
| 503 | Service Unavailable | Server temporarily unavailable |

### Common Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| INVALID_CREDENTIALS | 401 | Email/password combination incorrect |
| TOKEN_EXPIRED | 401 | JWT token expired |
| TOKEN_INVALID | 401 | JWT token malformed or invalid |
| RESOURCE_NOT_FOUND | 404 | Resource doesn't exist |
| RESOURCE_ARCHIVED | 410 | Resource archived, no longer available |
| PERMISSION_DENIED | 403 | User doesn't have permission |
| VALIDATION_ERROR | 400 | Input validation failed |
| DUPLICATE_RESOURCE | 409 | Resource already exists (e.g., email) |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Unexpected server error |

### Validation Error Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "errors": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
}
```

---

## Implementation Notes

### Database Schema

```sql
-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  theme VARCHAR(10) DEFAULT 'dark',
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat Sessions
CREATE TABLE chat_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  project_id INTEGER REFERENCES projects(id),
  title VARCHAR(255) NOT NULL,
  archived_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  chat_id INTEGER NOT NULL REFERENCES chat_sessions(id),
  role VARCHAR(50) NOT NULL, -- 'user' or 'ai'
  content TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'dione', -- 'dione' or 'claude'
  status VARCHAR(50) DEFAULT 'success',
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  archived_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  project_id INTEGER REFERENCES projects(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(50) DEFAULT 'medium',
  status VARCHAR(50) DEFAULT 'not_started',
  due_date TIMESTAMP,
  completed_at TIMESTAMP,
  archived_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Libraries (Uploaded Files)
CREATE TABLE libraries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  size INTEGER NOT NULL,
  file_path VARCHAR(512) NOT NULL, -- S3 path
  tags JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Artifacts (Scratchpad)
CREATE TABLE artifacts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  file_type VARCHAR(50),
  file_name VARCHAR(255),
  file_path VARCHAR(512),
  history TEXT[],
  history_index INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT FALSE,
  share_token VARCHAR(255) UNIQUE,
  views INTEGER DEFAULT 0,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Refresh Tokens (for logout/invalidation)
CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  token VARCHAR(512) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Technology Stack

- **Framework:** FastAPI (async Python web framework)
- **Database:** PostgreSQL with SQLAlchemy ORM
- **Authentication:** JWT (PyJWT library)
- **File Storage:** S3-compatible (AWS S3, MinIO, etc.)
- **Real-time:** WebSockets via FastAPI
- **Async:** asyncio + aiofiles for non-blocking I/O
- **Validation:** Pydantic models
- **Documentation:** OpenAPI/Swagger (automatic via FastAPI)

### Development Setup

```bash
# Install dependencies
pip install fastapi uvicorn sqlalchemy psycopg2 pydantic pyjwt python-multipart aiofiles boto3

# Create .env file
DATABASE_URL=postgresql://user:password@localhost:5432/dione
JWT_SECRET_KEY=your-secret-key-min-32-chars
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=dione-workspace

# Run server
uvicorn main:app --reload --port 8000
```

### Client Integration

```javascript
// React hook for API
const apiClient = fetch.withAuth = (url, options = {}) => {
  const token = localStorage.getItem('accessToken');
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

// Usage in component
const [chats, setChats] = useState([]);
useEffect(() => {
  apiClient('/api/v1/chats')
    .then(res => res.json())
    .then(data => setChats(data.data));
}, []);
```

### Security Considerations

1. **HTTPS Only:** All endpoints require HTTPS in production
2. **CORS:** Restrict to frontend origin only
3. **Rate Limiting:** 1000 req/min per user
4. **Input Validation:** Validate all inputs with Pydantic
5. **SQL Injection:** Use SQLAlchemy parameterized queries
6. **Password Hashing:** Use bcrypt with salt
7. **CSRF Protection:** Use CSRF tokens for state-changing requests
8. **XSS Prevention:** Sanitize all user input
9. **Data Encryption:** Encrypt sensitive data at rest

### Performance Optimizations

1. **Database Indexing:**
   ```sql
   CREATE INDEX idx_chat_user ON chat_sessions(user_id);
   CREATE INDEX idx_message_chat ON messages(chat_id);
   CREATE INDEX idx_task_user ON tasks(user_id);
   ```

2. **Query Optimization:** Use eager loading for related entities
3. **Caching:** Redis for frequently accessed data
4. **Pagination:** Always paginate list endpoints
5. **Lazy Loading:** Load message history on demand

### Deployment

1. **Docker:**
   ```dockerfile
   FROM python:3.11-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]
   ```

2. **Environment Variables:**
   - DATABASE_URL
   - JWT_SECRET_KEY
   - AWS_ACCESS_KEY_ID
   - AWS_SECRET_ACCESS_KEY
   - AWS_S3_BUCKET
   - FRONTEND_URL (for CORS)
   - ENVIRONMENT (development/production)

---

## Appendix: OpenAPI/Swagger

FastAPI automatically generates interactive API documentation at:
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

All endpoints, schemas, and authentication are documented there automatically.

---

**End of Specification**

Version 1.0.0 | Ready for Implementation | Last Updated: 2025-10-26
