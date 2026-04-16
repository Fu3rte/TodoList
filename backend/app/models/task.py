from tortoise import fields
from tortoise.models import Model
from app.models.enums import Priority


class Task(Model):
    id = fields.IntField(pk=True)
    title = fields.CharField(max_length=255)
    description = fields.TextField(null=True)
    category = fields.ForeignKeyField("models.Category", related_name="tasks", null=True)
    priority = fields.CharEnumField(enum_type=Priority, null=True)
    due_date = fields.DatetimeField(null=True)
    is_completed = fields.BooleanField(default=False)
    user = fields.ForeignKeyField("models.User", related_name="tasks")
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)
    tags: fields.ManyToManyRelation["Tag"]


class TaskTag(Model):
    id = fields.IntField(pk=True)
    task = fields.ForeignKeyField("models.Task", related_name="task_tags")
    tag = fields.ForeignKeyField("models.Tag", related_name="tag_tasks")
