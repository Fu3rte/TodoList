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
