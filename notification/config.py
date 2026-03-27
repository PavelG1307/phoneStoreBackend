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
    smtp_host: str
    smtp_port: int
    smtp_user: str
    smtp_password: str
    smtp_from: str
    smtp_tls: bool
    smtp_ssl: bool

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

        self.smtp_host = self.getFromEnv('SMTP_HOST')
        self.smtp_port = int(self.getOrDefaultFromEnv('SMTP_PORT', '587'))
        self.smtp_user = self.getFromEnv('SMTP_USER')
        self.smtp_password = self.getFromEnv('SMTP_PASSWORD')
        self.smtp_from = self.getOrDefaultFromEnv('SMTP_FROM', self.smtp_user)
        self.smtp_tls = self.getOrDefaultFromEnv('SMTP_TLS', 'true').lower() == 'true'
        self.smtp_ssl = self.getOrDefaultFromEnv('SMTP_SSL', 'false').lower() == 'true'

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
                'smtp_host': self.smtp_host,
                'smtp_port': self.smtp_port,
                'smtp_user': self.smtp_user,
                'smtp_from': self.smtp_from,
                'smtp_tls': self.smtp_tls,
                'smtp_ssl': self.smtp_ssl,
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