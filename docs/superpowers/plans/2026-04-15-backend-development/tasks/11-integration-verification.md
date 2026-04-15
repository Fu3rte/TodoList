# Task 11: Integration Verification

**Goal:** Verify backend starts successfully and test all endpoints.

---

## Step 1: Verify backend starts successfully

```bash
cd backend && uvicorn app.main:app --reload --port 8000
```

Expected: Server starts on http://localhost:8000 with /health endpoint returning {"status": "healthy"}

## Step 2: Test registration

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "test123"}'
```

Expected: Returns user object with id, username, email, created_at

## Step 3: Test login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -d "username=test@example.com&password=test123"
```

Expected: Returns access_token, refresh_token, token_type

## Step 4: Test get current user

```bash
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer <access_token>"
```

Expected: Returns current user object

## Step 5: Test category CRUD

```bash
# Create category
curl -X POST http://localhost:8000/api/categories \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Work"}'

# Get categories
curl http://localhost:8000/api/categories \
  -H "Authorization: Bearer <access_token>"
```

## Step 6: Test tag CRUD

```bash
# Create tag
curl -X POST http://localhost:8000/api/tags \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "urgent"}'

# Get tags
curl http://localhost:8000/api/tags \
  -H "Authorization: Bearer <access_token>"
```

## Step 7: Test task CRUD with filtering

```bash
# Create task
curl -X POST http://localhost:8000/api/tasks \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Complete project", "priority": "high"}'

# Get tasks with pagination
curl "http://localhost:8000/api/tasks?page=1&page_size=10" \
  -H "Authorization: Bearer <access_token>"

# Toggle task completion
curl -X PATCH http://localhost:8000/api/tasks/1/toggle \
  -H "Authorization: Bearer <access_token>"

# Filter by priority
curl "http://localhost:8000/api/tasks?priority=high" \
  -H "Authorization: Bearer <access_token>"
```

## Step 8: Test token refresh

```bash
curl -X POST http://localhost:8000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token": "<refresh_token>"}'
```

Expected: Returns new access_token and refresh_token
