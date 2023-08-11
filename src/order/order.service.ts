import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/sequelize"
import { Op } from "sequelize"
import { OrderItem } from "src/models/orderItem.model"
import { Order } from "../models/order.model"
import { UUID } from "../models/types"
import { CreateOrderDto } from "./dto/create-order.dto"
import { PromoCode } from "src/models/promoCode.model"
import { PromoCodeService } from "src/promocode/promocode.service"

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order)
    private readonly OrderModel: typeof Order,
    private readonly promoCodeService: PromoCodeService
  ) {}

  async get(uuid: UUID) {
    const order = await Order.findOne({ 
      where: { uuid },
      include: [OrderItem, PromoCode]
    })
    return {
      uuid: order.uuid,
      status: order.status,
      fullName: order.fullName,
      phoneNumber: order.phoneNumber,
      items: order.items,
      communicationMethod: order.communicationMethod,
      delivery: order.delivery,
      deliveryMessage: order.deliveryMessage,
      promoCodeUUID: order.promoCodeUUID,
      paymentTypeId: order.paymentTypeId,
      email: order.email,
      payerTypeId: order.payerTypeId,
      comment: order.comment,
      promoCode: order.promoCodeUUID && order.promoCode ? {
        uuid: order.promoCode.uuid,
        name: order.promoCode.name,
        discount: order.promoCode.discount,
      } : null,
      updatedAt: order.updatedAt,
      createdAt: order.createdAt,
    }
  }

  async getAll() {
    const orders = Order.findAll({ 
      include: [OrderItem, PromoCode]
    })
    return orders
  }

  async getStatistics(opts: {
      from?: string | number,
      to?: string | number
    }) {
    const dateTo = opts.to
      ? new Date(opts.to)
      : new Date()
    const dateFrom = opts.from
      ? new Date(opts.from)
      : new Date(new Date().setMonth(new Date().getMonth() - 1))
    const periodTo = dateTo.valueOf()
    const periodFrom = dateFrom.valueOf()
    const pervoicePeriodFrom = 2 * periodFrom - periodTo
    const numberNewOrders = await Order.count({
      where: {
        createdAt: {
          [Op.between]: [periodFrom, periodTo]
        },
        status: 0
      }
    })
    const numberNewOrdersPervoicePeriod = await Order.count({
      where: {
        createdAt: {
          [Op.between]: [pervoicePeriodFrom, periodFrom]
        },
        status: 0
      }
    })
    
    const numberOrders = await Order.count({
      where: {
        createdAt: {
          [Op.between]: [periodFrom, periodTo]
        },
      }
    })
    const numberOrdersPervoicePeriod = await Order.count({
      where: {
        createdAt: {
          [Op.between]: [pervoicePeriodFrom, periodFrom]
        },
      }
    })

    const numberComplitedOrders = await Order.count({
      where: {
        createdAt: {
          [Op.between]: [periodFrom, periodTo]
        },
        status: 2
      }
    })

    const numberComplitedOrdersPervoicePeriod = await Order.count({
      where: {
        createdAt: {
          [Op.between]: [pervoicePeriodFrom, periodFrom]
        },
        status: 2
      }
    })

    return {
      period: [periodFrom, periodTo],
      all: {
        value: numberOrders,
        pervoiceValue: numberOrdersPervoicePeriod
      },
      new: {
        value: numberNewOrders,
        pervoiceValue: numberNewOrdersPervoicePeriod
      },
      complited: {
        value: numberComplitedOrders,
        pervoiceValue: numberComplitedOrdersPervoicePeriod
      }
    }
  }

  async create(orderDto: CreateOrderDto) {
    const sequelize = Order.sequelize
    const trx = await sequelize.transaction()

    try {
      if (orderDto.promoCodeUUID) {
        const promoCode = await PromoCode.findOne({
          where: {
            uuid: orderDto.promoCodeUUID,
            isDisabled: false,
            isDeleted: false,
          },
          transaction: trx
        })

        this.promoCodeService.validatePromoCode(promoCode)

        if (promoCode.quantity) {
          await PromoCode.update({
            quantity: promoCode.quantity - 1
          }, {
            where: {
              uuid: promoCode.uuid
            }
          })
        }
      }

      const newOrder = await Order.create({...orderDto, promoCode: undefined}, {
        returning: true,
        include: [OrderItem],
        transaction: trx
      })
      
      trx.commit()

      return this.get(newOrder.uuid)
    } catch (error) {
      trx.rollback()
      throw error
    }
  }

  async update(uuid: string, Order: Partial<Order>) {
    return Order.update(Order, {
      where: {
        uuid
      }
    })
  }

  async delete(uuid: string) {
    const success =  await Order.destroy({
      where: {
        uuid
      }
    })
    if (!success) throw new HttpException('Order not found', HttpStatus.NOT_FOUND)
    return
  }
}
