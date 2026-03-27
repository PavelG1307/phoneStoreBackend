import rollbar
import traceback
from datetime import datetime

class Logger:
    def __init__(self, level, rollbar_is_enable, rollbar_token, env, code_version='1.0'):
        self.level = level
        self.rollbar_is_enable = rollbar_is_enable
        self.is_dev = env != 'prod'
        if rollbar_is_enable:
            self.rollbar = rollbar.init(
                access_token=rollbar_token,
                environment=env,
                code_version=code_version
            )

    def error(self, err: Exception):
        print(self.formatLog(err))
        print(traceback.format_exc())
        if self.rollbar_is_enable and not self.is_dev:
            rollbar.report_exc_info()

    def info(self, msg):
        print(self.formatLog(msg))
        if self.rollbar_is_enable  and not self.is_dev \
            and self.level == 'info' or self.level == 'debug':
            rollbar.report_message(msg, 'info')

    def debug(self, msg):
        if self.level == 'debug':
            print(self.formatLog(msg))

    def formatLog(self, msg: str):
        time = str(datetime.now())
        return f'[{time}] – {msg}'