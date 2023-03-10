import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/sequelize"
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
    const Orders = Order.findAll({ 
      include: [OrderItem]
    })
    return Orders
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
}
