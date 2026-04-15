from tortoise import fields
from tortoise.models import Model


class Tag(Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=50)
    user = fields.ForeignKeyField("models.User", related_name="tags")
    created_at = fields.DatetimeField(auto_now_add=True)

    tasks: fields.ManyToManyRelation["Task"]
