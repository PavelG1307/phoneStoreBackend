import { Injectable } from "@nestjs/common"
import { getModelToken, InjectModel } from "@nestjs/sequelize"
import { Category } from "src/models/category.model"
import { OrderItem } from "src/models/orderItem.model"
import { Product } from "src/models/product.model"
import { Order } from "../models/Order.model"
import { UUID } from "../models/types"
import { CreateOrderDto } from "./dto/create-Order.dto"

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
    // const newOrder = Order.create({...OrderDto}, {
    //   returning: true
    // })
    // return newOrder
  }

  async update(uuid: string, Order: Partial<Order>) {
    // console.log(uuid)
    // return Order.update(Order, {
    //   where: { uuid },
    //   returning: true
    // })
  }
}
