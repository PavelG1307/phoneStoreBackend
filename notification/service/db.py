from peewee import PostgresqlDatabase, Model
from config import Config

config = Config(False)

database = PostgresqlDatabase(
    database=config.db_name,
    user=config.db_user,
    password=config.db_password,
    host=config.db_host,
    port=config.db_port,
)

database.execute_sql('set timezone="-03:00"')

class BaseModel(Model):
    class Meta:
        database = database
