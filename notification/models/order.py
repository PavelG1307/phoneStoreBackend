from service.db import BaseModel
from peewee import PrimaryKeyField, CharField, UUIDField, IntegerField, DateTimeField, BooleanField

class Order(BaseModel):
    class Meta:
        db_table = "Orders"

    uuid = UUIDField(primary_key=True)
    fullName = CharField()
    phoneNumber = CharField()
    delivery = IntegerField()
    deliveryMessage = CharField()
    promoCodeUUID = UUIDField()
    status = IntegerField()
    promoCodeUUID = UUIDField()
    createdAt = DateTimeField()
    updatedAt = DateTimeField()
    deletedAt = DateTimeField()
    paymentTypeId = IntegerField()
    email = CharField()
    payerTypeId = IntegerField()
    comment = CharField()
    isNotified = BooleanField()
