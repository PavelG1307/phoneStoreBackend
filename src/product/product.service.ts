import { Injectable, Query } from "@nestjs/common"
import { InjectModel } from "@nestjs/sequelize"
import { Product } from "src/models/product.model"
import { CreateProductDto } from "./dto/create-product.dto"
import { Op } from 'sequelize'

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product
  ) {}

  async get(uuid: uuid) {
    const products = await Product.findAll({ where: { uuid }})
    return products
  }

  async getAll() {
    const products = Product.findAll({ where: { visible: true }})
    return products
  }

  async create(product: CreateProductDto) {
    const newProduct = Product.create(product, {
      returning: true
    })
    return newProduct
  }

  async update(uuid: string, product: Product) {
    return Product.update(product, {
      where: { uuid },
      returning: true
    })
  }

  async delete(uuid: string) {
    return Product.destroy({ where: { uuid } })
  }
}
