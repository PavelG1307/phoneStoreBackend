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

  async getStatistics() {
    const periodTo = new Date().valueOf()
    const periodFrom = new Date().setMonth(new Date().getMonth() - 3).valueOf()
    const pervoicePeriodFrom = new Date(periodFrom).setMonth(new Date(periodFrom).getMonth() - 3).valueOf()
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
          [Op.between]: [pervoicePeriodFrom, periodFrom]
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

  async create(OrderDto: CreateOrderDto) {
    const newOrder = Order.create({...OrderDto}, {
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
