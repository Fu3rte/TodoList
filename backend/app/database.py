from tortoise import Tortoise
from app.config import get_settings


TORTOISE_ORM = {
    "connections": {"default": None},
    "apps": {
        "models": {
            "models": ["app.models"],
            "default_connection": "default",
        },
    },
    "use_tz": False,
    "timezone": "UTC",
}


async def init_db():
    settings = get_settings()
    TORTOISE_ORM["connections"]["default"] = settings.database_url
    await Tortoise.init(
        db_url=TORTOISE_ORM["connections"]["default"],
        modules={"models": ["app.models"]},
        use_tz=False,
        timezone="UTC",
    )
    # Skip generate_schemas() - tables are pre-created with proper AUTO_INCREMENT
    # await Tortoise.generate_schemas()


async def close_db():
    await Tortoise.close_connections()
