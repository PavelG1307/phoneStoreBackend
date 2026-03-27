import time
import smtplib
from pyrogram import Client
from config import Config
from constants import BOT_NAME
from logger import Logger
from models import Order, Param, ParamTypes, OrderItem
from pyrogram.types import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from email.message import EmailMessage

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
    emailToParam = Param.select().where(Param.id == ParamTypes.EMAIL_TO).get()
    orders = Order.select().where(Order.isNotified == False)
    count = 0

    if len(orders) == 0:
        return count

    recipients = parseRecipients(emailToParam.value)
    if len(recipients) == 0:
        raise Exception('EMAIL_TO is empty (Params.id=3)')

    for order in orders:
        try:
            subject = getSubject(order)
            text_body = getMessageText(order)
            html_body = getMessageHtml(order)
            sendEmailNotification(config, recipients, subject, text_body, html_body)
            order.isNotified = True
            order.save()
            count += 1
        except Exception as e:
            logger.error(e)
            continue
        time.sleep(1)

    return count

def sendNotification(app: Client, tgChatId: int, message: str):
    url = 'https://rk-tech.shop/admin'
    button = InlineKeyboardButton(url=url, text='Открыть личный кабинет')
    markup = InlineKeyboardMarkup([[button]])
    app.send_message(tgChatId, message, reply_markup=markup)

def sendEmailNotification(config: Config, to_email: str, subject: str, body: str, html_body: str):
    if config.smtp_ssl:
        server = smtplib.SMTP_SSL(config.smtp_host, config.smtp_port, timeout=30)
    else:
        server = smtplib.SMTP(config.smtp_host, config.smtp_port, timeout=30)

    try:
        if config.smtp_tls and not config.smtp_ssl:
            server.starttls()
        if config.smtp_user and config.smtp_password:
            server.login(config.smtp_user, config.smtp_password)
        for recipient in to_email:
            msg = EmailMessage()
            msg["From"] = config.smtp_from
            msg["To"] = recipient
            msg["Subject"] = subject
            msg.set_content(body)
            if html_body:
                msg.add_alternative(html_body, subtype="html")
            server.send_message(msg)
    finally:
        try:
            server.quit()
        except Exception:
            pass

def parseRecipients(raw: str):
    if not raw:
        return []
    parts = raw.replace(';', ',').split(',')
    recipients = []
    for p in parts:
        email = p.strip()
        if email:
            recipients.append(email)
    return recipients

def getSubject(order: Order):
    return f'Новый заказ {order.uuid}'

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

    return 'Новый заказ!\n' + \
        f'ФИО: {order.fullName}\n' + \
        f'Номер телефона: {order.phoneNumber}\n' + \
        f'Email: {email}\n\n' + \
        f'Товары:\n' + \
        f'{products}\n' + \
        f'Способ доставки: {deliveryType}\n' + \
        f'Информация о доставке: {deliveryMessage}\n' + \
        f'Способ оплаты: {paymentType}\n' + \
        f'Комментарий к заказу: {comment}\n'

def escapeHtml(value):
    if value is None:
        return ''
    return (str(value)
        .replace('&', '&amp;')
        .replace('<', '&lt;')
        .replace('>', '&gt;')
        .replace('"', '&quot;')
        .replace("'", '&#39;'))

def moneyRub(value):
    try:
        return f'{int(value)} ₽'
    except Exception:
        return f'{value} ₽'

def getMessageHtml(order: Order):
    orderItems = OrderItem.select().where(OrderItem.orderUUID == order.uuid)

    items_rows = ''
    for item in orderItems:
        tags_html = ''
        if item.tags and len(item.tags) > 0:
            tags_html = f"<div style=\"color:#6b7280;font-size:12px;margin-top:2px;\">{escapeHtml(', '.join(item.tags))}</div>"
        count = item.count if item.count else 1
        items_rows += f"""
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
              <div style="font-weight:600;color:#111827;">{escapeHtml(item.name)}</div>
              {tags_html}
              <div style="color:#6b7280;font-size:12px;margin-top:4px;">Кол-во: {escapeHtml(count)}</div>
            </td>
            <td align="right" style="padding:12px 0;border-bottom:1px solid #e5e7eb;color:#111827;font-weight:600;white-space:nowrap;">
              {escapeHtml(moneyRub(item.price))}
            </td>
          </tr>
        """

    deliveryType = getDeliveryType(order.delivery)
    paymentType = getPaymentType(order.paymentTypeId)

    full_name = escapeHtml(order.fullName)
    phone = escapeHtml(order.phoneNumber)
    email = escapeHtml(order.email if order.email else '-')
    comment = escapeHtml(order.comment if order.comment else '-')
    delivery_message = escapeHtml(order.deliveryMessage if order.deliveryMessage else '-')
    order_uuid = escapeHtml(order.uuid)

    admin_url = 'https://rk-tech.shop/admin'

    return f"""\
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light only" />
    <title>Новый заказ</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#111827;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      Новый заказ {order_uuid}
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f4f6;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 24px rgba(17,24,39,0.08);">
            <tr>
              <td style="padding:20px 24px;background:linear-gradient(135deg,#111827,#1f2937);color:#ffffff;">
                <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.85;">PhoneStore</div>
                <div style="font-size:22px;font-weight:800;margin-top:6px;">Новый заказ</div>
                <div style="font-size:13px;opacity:.9;margin-top:6px;">UUID: {order_uuid}</div>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 24px 8px 24px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding:0 0 10px 0;">
                      <div style="font-size:14px;color:#6b7280;">Клиент</div>
                      <div style="font-size:16px;font-weight:700;margin-top:2px;">{full_name}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 0 2px 0;font-size:14px;color:#374151;">
                      <span style="color:#6b7280;">Телефон:</span> {phone}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 0 12px 0;font-size:14px;color:#374151;">
                      <span style="color:#6b7280;">Email:</span> {email}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:0 24px;">
                <div style="height:1px;background:#e5e7eb;"></div>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 24px 0 24px;">
                <div style="font-size:14px;color:#6b7280;margin-bottom:8px;">Товары</div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;">
                  {items_rows}
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 24px 0 24px;">
                <div style="height:1px;background:#e5e7eb;"></div>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 24px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:14px;color:#374151;">
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;width:170px;">Доставка</td>
                    <td style="padding:6px 0;font-weight:600;color:#111827;">{escapeHtml(deliveryType)}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;">Инфо о доставке</td>
                    <td style="padding:6px 0;">{delivery_message}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;">Оплата</td>
                    <td style="padding:6px 0;font-weight:600;color:#111827;">{escapeHtml(paymentType)}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;">Комментарий</td>
                    <td style="padding:6px 0;">{comment}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:0 24px 24px 24px;">
                <a href="{admin_url}" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:12px 16px;border-radius:10px;font-weight:700;font-size:14px;">
                  Открыть админку
                </a>
                <div style="font-size:12px;color:#6b7280;margin-top:10px;">
                  Если кнопка не работает, откройте ссылку: <span style="color:#111827;">{admin_url}</span>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
"""

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
