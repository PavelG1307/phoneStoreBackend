import bot
from logger import Logger
from config import Config

def main():
    config = Config()
    logger = Logger(
        level=config.logger_level,
        rollbar_is_enable=config.rollbar_is_enable,
        rollbar_token=config.rollbar_token,
        env=config.env,
        code_version=config.code_version
    )
    bot.start(config, logger)

if __name__ == '__main__':
    main()