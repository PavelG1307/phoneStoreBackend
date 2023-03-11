import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/sequelize"
import { Op } from "sequelize"
import { OrderItem } from "src/models/orderItem.model"
import { Order } from "../models/order.model"
import { UUID } from "../models/types"
import { CreateOrderDto } from "./dto/create-order.dto"

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order)
    private readonly OrderModel: typeof Order
  ) {}

  async get(uuid: UUID) {
    const Orders = await Order.findOne({ 
      where: { uuid },
      include: [OrderItem]
    })
    return Orders
  }

  async getAll() {
    const orders = Order.findAll({ 
      include: [OrderItem]
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
    console.log(orderDto);
    const newOrder = Order.create({...orderDto}, {
      returning: true,
      include: [OrderItem]
    })
    return newOrder
  }

  async update(uuid: string, order: Partial<Order>) {
    return Order.update(order, {
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
