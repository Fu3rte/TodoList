from tortoise import fields
from tortoise.models import Model


class Category(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=100)
    parent_id = fields.IntField(null=True)
    user = fields.ForeignKeyField("models.User", related_name="categories")
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    children: fields.ReverseRelation["Category"]
    tasks: fields.ReverseRelation["Task"]