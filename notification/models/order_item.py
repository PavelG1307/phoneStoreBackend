from service.db import BaseModel
from peewee import PrimaryKeyField, CharField, UUIDField, IntegerField, DateTimeField
from playhouse.postgres_ext import ArrayField

class OrderItem(BaseModel):
    class Meta:
        db_table = "OrderItems"

    uuid = PrimaryKeyField(UUIDField)
    orderUUID = UUIDField()
    productUUID = UUIDField()
    price = IntegerField()
    name = CharField()
    tags = ArrayField(CharField)
    images = ArrayField(CharField)
    count = IntegerField()
    createdAt = DateTimeField()
    updatedAt = DateTimeField()
