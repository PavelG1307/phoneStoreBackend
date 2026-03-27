import time
from pyrogram import Client
from config import Config
from constants import BOT_NAME
from logger import Logger
from models import Order, Param, ParamTypes, OrderItem
from pyrogram.types import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo

countNotifications = 0

def configureBotApp(config: Config):
    app = Client(
        name=BOT_NAME,
        api_id=config.bot_api_id,
        api_hash=config.bot_api_hash,
        bot_token=config.bot_token
    )
    return app

def start(config: Config, logger: Logger):
    global countNotifications

    while True:
        try:
            count = doPerformJob(config, logger)
            countNotifications += count
            logger.debug(f'Отправлено: {count}, всего: {countNotifications}')
        except Exception as e:
            logger.error(e)

        time.sleep(config.timeout)


def doPerformJob(config: Config, logger: Logger):
    tgChatParam = Param.select().where(Param.id == ParamTypes.TG_CHAT_ID).get()
    orders = Order.select().where(Order.isNotified == False)
    count = 0

    if len(orders) == 0:
        return count
    
    app = configureBotApp(config)
    app.start()

    for order in orders:
        try:
            message = getMessageText(order)
            sendNotification(app, int(tgChatParam.value), message)
            order.isNotified = True
            order.save()
            count += 1
        except Exception as e:
            logger.error(e)
            continue
        time.sleep(1)

    app.stop()
    return count

def sendNotification(app: Client, tgChatId: int, message: str):
    url = 'https://rk-tech.shop/admin'
    button = InlineKeyboardButton(url=url, text='Открыть личный кабинет')
    markup = InlineKeyboardMarkup([[button]])
    app.send_message(tgChatId, message, reply_markup=markup)

def getMessageText(order: Order):
    orderItems = OrderItem.select().where(OrderItem.orderUUID == order.uuid)
    products = ''
    for item in orderItems:
        products += item.name
        if item.tags and len(item.tags) > 0:
            tags = ''
            for tag in item.tags:
                tags += f'{tag}, '
            tags = tags[:-2]
            products += f' ({tags})'
        products += ' – '
        products += f'{item.price} рублей'
        products += '\n'

    email = getValueOrDash(order.email)
    comment = getValueOrDash(order.comment)
    deliveryMessage = getValueOrDash(order.deliveryMessage)
    deliveryType = getDeliveryType(order.delivery)
    paymentType = getPaymentType(order.paymentTypeId)

    return '**Новый заказ!**\n' + \
        f'ФИО: {order.fullName}\n' + \
        f'Номер телефона: {order.phoneNumber}\n' + \
        f'Email: {email}\n\n' + \
        f'Товары:\n' + \
        f'{products}\n' + \
        f'Способ доставки: {deliveryType}\n' + \
        f'Информация о доставке: {deliveryMessage}\n' + \
        f'Способ оплаты: {paymentType}\n' + \
        f'Комментарий к заказу: {comment}\n'

def getValueOrDash(value):
    return value if value else '-'

def getDeliveryType(id):
    if id == 1:
        return 'Самовывоз из офиса г. Москва'
    if id == 2:
        return 'Доставка по Москве внутри МКАД'
    if id == 3:
        return 'Доставка СДЭК в регионы'
    if id == 4:
        return 'Самовывоз из магазина г. Рязань'
    return '-'

def getPaymentType(id):
    if id == 1:
        return 'Наличными при получении'
    if id == 2:
        return 'Оформление рассрочки'
    if id == 3:
        return 'Безналичный расчет для юридических лиц без НДС'
    return '-'
