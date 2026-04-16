from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import init_db, close_db
from app.api.routes import api_router
from app.core.exceptions import http_exception_handler, does_not_exist_handler, integrity_error_handler
from tortoise.exceptions import DoesNotExist, IntegrityError
from fastapi import HTTPException


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield
    await close_db()


app = FastAPI(
    title="TodoList API",
    description="TodoList backend API with authentication, categories, tags, and tasks",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(DoesNotExist, does_not_exist_handler)
app.add_exception_handler(IntegrityError, integrity_error_handler)

app.include_router(api_router, prefix="/api")


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
