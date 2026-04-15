from tortoise import Tortoise

TORTOISE_ORM = {
    "connections": {"default": "mysql://root:password@localhost:3306/todolist"},
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
    await Tortoise.init(
        db_url=TORTOISE_ORM["connections"]["default"],
        modules={"models": ["app.models"]},
        use_tz=False,
        timezone="UTC",
    )
    await Tortoise.generate_schemas()


async def close_db():
    await Tortoise.close_connections()
