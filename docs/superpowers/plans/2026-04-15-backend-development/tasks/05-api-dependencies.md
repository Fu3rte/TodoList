# Task 5: API Dependencies

**Goal:** Create FastAPI dependencies for authentication (get_current_user, get_db).

**Files:**
- Create: `backend/app/api/__init__.py`
- Create: `backend/app/api/deps.py`

---

## Step 1: Create app/api/__init__.py

```python
from app.api.deps import get_current_user

__all__ = ["get_current_user"]
```

## Step 2: Create app/api/deps.py

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from tortoise.exceptions import DoesNotExist
from app.models.user import User
from app.core.security import verify_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = verify_token(token, token_type="access")
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    try:
        user = await User.get(id=user_id)
    except DoesNotExist:
        raise credentials_exception

    return user
```

## Step 3: Commit

```bash
git add backend/app/api/deps.py
git commit -m "feat: add API dependencies for auth"
```
