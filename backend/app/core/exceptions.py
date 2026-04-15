from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from tortoise.exceptions import DoesNotExist, IntegrityError


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


async def does_not_exist_handler(request: Request, exc: DoesNotExist) -> JSONResponse:
    return JSONResponse(
        status_code=404,
        content={"detail": "Resource not found"},
    )


async def integrity_error_handler(request: Request, exc: IntegrityError) -> JSONResponse:
    return JSONResponse(
        status_code=400,
        content={"detail": "Resource already exists or violates constraints"},
    )
