from tortoise import fields
from tortoise.models import Model


class User(Model):
    id = fields.IntField(pk=True)
    username = fields.CharField(max_length=100, unique=True)
    email = fields.CharField(max_length=255, unique=True)
    hashed_password = fields.CharField(max_length=255)
    created_at = fields.DatetimeField(auto_now_add=True)

    tasks: fields.ReverseRelation["Task"]
    categories: fields.ReverseRelation["Category"]
    tags: fields.ReverseRelation["Tag"]
