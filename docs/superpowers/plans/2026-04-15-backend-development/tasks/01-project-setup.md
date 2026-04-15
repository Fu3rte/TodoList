# Task 1: Project Setup & Configuration

**Goal:** Create backend project skeleton with all configuration files.

**Files:**
- Create: `backend/requirements.txt`
- Create: `backend/.env`
- Create: `backend/aerich.ini`
- Create: `backend/app/__init__.py`
- Create: `backend/app/config.py`
- Create: `backend/app/database.py`

---

## Step 1: Create requirements.txt

```txt
fastapi==0.115.0
uvicorn[standard]==0.30.0
tortoise-orm==0.21.0
aerich==0.7.2
aiomysql==0.2.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.9
pydantic==2.8.0
pydantic-settings==2.4.0
python-dotenv==1.0.1
```

## Step 2: Create .env

```env
DATABASE_URL=mysql://root:password@localhost:3306/todolist
SECRET_KEY=change-me-in-production-use-openssl-rand-hex-32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
FRONTEND_URL=http://localhost:5173
```

## Step 3: Create aerich.ini

```ini
[aerich]
locations = ./migrations
models = app.models
```

## Step 4: Create app/config.py

```python
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    frontend_url: str = "http://localhost:5173"

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
```

## Step 5: Create app/database.py

```python
from tortoise import Tortoise
from app.config import get_settings


async def init_db():
    settings = get_settings()
    await Tortoise.init(
        db_url=settings.database_url,
        modules={"models": ["app.models"]},
        use_tz=False,
        timezone="UTC",
    )
    await Tortoise.generate_schemas()


async def close_db():
    await Tortoise.close_connections()
```

## Step 6: Create app/__init__.py

```python
# app package
```

## Step 7: Commit

```bash
git add backend/requirements.txt backend/.env backend/aerich.ini backend/app/
git commit -m "feat: add backend project skeleton and configuration"
```
