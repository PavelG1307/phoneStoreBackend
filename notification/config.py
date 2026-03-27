import dotenv
import os
import constants

dotenv.load_dotenv(constants.ENV_FILE_PATH)

class Config:
    bot_token: str
    bot_api_id: str
    bot_api_hash: str
    rollbar_is_enable: bool
    rollbar_token: str
    env: str
    logger_level: str
    code_version: str
    job_timeout: int
    db_host: str
    db_port: str
    db_user: str
    db_password: str
    db_name: str
    timeout: int

    def __init__(self, is_first_time=True):
        self.bot_token = self.getFromEnv('BOT_TOKEN')
        self.bot_api_id = self.getFromEnv('BOT_API_ID')
        self.bot_api_hash = self.getFromEnv('BOT_API_HASH')
        self.rollbar_token = self.getFromEnv('ROLLBAR_TOKEN')
        self.rollbar_is_enable = bool(self.rollbar_token)
        self.env = self.getOrDefaultFromEnv('NODE_ENV', 'dev')
        self.logger_level = self.getOrDefaultFromEnv('LOGGER_LEVEL', 'info')
        self.code_version = self.getFromEnv('VERSION')
        self.db_host = self.getFromEnv('DB_HOST')
        self.db_port = self.getFromEnv('DB_PORT')
        self.db_user = self.getFromEnv('DB_USER')
        self.db_password = self.getFromEnv('DB_PASSWORD')
        self.db_name = self.getFromEnv('DB_NAME')
        self.timeout = int(self.getOrDefaultFromEnv('TIMEOUT', '300'))

        if (is_first_time):
            config = {
                'bot_token': self.bot_token,
                'bot_api_id': self.bot_api_id,
                'bot_api_hash': self.bot_api_hash,
                'rollbar_token': self.rollbar_token,
                'rollbar_is_enable': self.rollbar_is_enable,
                'env': self.env,
                'logger_level': self.logger_level,
                'code_version': self.code_version,
                'db_host': self.db_host,
                'db_port': self.db_port,
                'db_user': self.db_user,
                'db_password': self.db_password,
                'db_name': self.db_name,
                'timeout': self.timeout,
            }
            print(config)

    def getFromEnv(self, key):
        return os.getenv(key)
    
    def getOrDefaultFromEnvInt(self, key, default):
        strValue = self.getOrDefaultFromEnv(key, str(default))
        return int(strValue)

    def getOrDefaultFromEnv(self, key, default):
        value = self.getFromEnv(key)
        if not value:
            return default
        return value