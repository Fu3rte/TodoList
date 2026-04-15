# Task 6: Auth API Routes

**Goal:** Implement authentication endpoints (register, login, refresh, me).

**Files:**
- Create: `backend/app/api/routes/__init__.py`
- Create: `backend/app/api/routes/auth.py`
- Create: `backend/app/services/__init__.py`
- Create: `backend/app/services/auth_service.py`

---

## Step 1: Create app/api/routes/__init__.py

```python
from fastapi import APIRouter
from app.api.routes import auth, categories, tags, tasks

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(tags.router, prefix="/tags", tags=["tags"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])

__all__ = ["api_router"]
```

## Step 2: Create app/services/__init__.py

```python
from app.services.auth_service import AuthService
from app.services.category_service import CategoryService
from app.services.tag_service import TagService
from app.services.task_service import TaskService

__all__ = ["AuthService", "CategoryService", "TagService", "TaskService"]
```

## Step 3: Create app/services/auth_service.py

```python
from tortoise.exceptions import DoesNotExist, IntegrityError
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.core.security import get_password_hash, verify_password, create_access_token, create_refresh_token


class AuthService:
    @staticmethod
    async def register(user_data: UserCreate) -> User:
        try:
            hashed_password = get_password_hash(user_data.password)
            user = await User.create(
                username=user_data.username,
                email=user_data.email,
                hashed_password=hashed_password,
            )
            return user
        except IntegrityError:
            raise ValueError("User with this email or username already exists")

    @staticmethod
    async def authenticate(credentials: UserLogin) -> User:
        try:
            user = await User.get(email=credentials.email)
        except DoesNotExist:
            raise ValueError("Invalid email or password")

        if not verify_password(credentials.password, user.hashed_password):
            raise ValueError("Invalid email or password")

        return user

    @staticmethod
    async def get_user_by_id(user_id: int) -> User:
        return await User.get(id=user_id)
```

## Step 4: Create app/api/routes/auth.py

```python
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.schemas.token import TokenResponse, RefreshTokenRequest
from app.schemas.auth import AuthService
from app.core.security import create_access_token, create_refresh_token, verify_token
from app.api.deps import get_current_user

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    try:
        user = await AuthService.register(user_data)
        return user
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/login", response_model=TokenResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    credentials = UserLogin(email=form_data.username, password=form_data.password)
    try:
        user = await AuthService.authenticate(credentials)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user.id})
    refresh_token = create_refresh_token(data={"sub": user.id})

    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(refresh_data: RefreshTokenRequest):
    try:
        payload = verify_token(refresh_data.refresh_token, token_type="refresh")
        user_id = payload.get("sub")
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    access_token = create_access_token(data={"sub": user_id})
    new_refresh_token = create_refresh_token(data={"sub": user_id})

    return TokenResponse(access_token=access_token, refresh_token=new_refresh_token)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
```

## Step 5: Fix auth.py import (add UserLogin to schemas/user.py imports)

```python
# In app/schemas/user.py, add UserLogin to imports:
from app.schemas.user import UserCreate, UserResponse, UserLogin
```

## Step 6: Commit

```bash
git add backend/app/api/routes/auth.py backend/app/services/auth_service.py
git commit -m "feat: add auth endpoints (register, login, refresh, me)"
```
