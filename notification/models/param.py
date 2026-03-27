
from service.db import BaseModel
from peewee import PrimaryKeyField, CharField

class Param(BaseModel):
    class Meta:
        db_table = "Params"

    id = PrimaryKeyField()
    value = CharField()


class ParamTypes:
    TG_CHAT_ID = 1
    POPUP_MESSAGE = 2