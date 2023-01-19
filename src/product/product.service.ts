import { Injectable } from "@nestjs/common"
import { getModelToken, InjectModel } from "@nestjs/sequelize"
import { Category } from "src/models/category.model"
import { Product } from "../models/product.model"
import { UUID } from "../models/types"
import { CreateProductDto } from "./dto/create-product.dto"

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product
  ) {}

  async get(uuid: UUID) {
    const products = await Product.findOne({ 
      where: { uuid },
      include: [Category]
    })
    return products
  }

  async getAll() {
    const products = Product.findAll({ 
      where: { visible: true },
      include: [Category]
    })
    return products
  }

  async create(product: CreateProductDto) {
    const newProduct = Product.create(product, {
      returning: true
    })
    return newProduct
  }

  async update(uuid: string, product: Partial<Product>) {
    console.log(uuid)
    return Product.update(product, {
      where: { uuid },
      returning: true
    })
  }

  async delete(uuid: string) {
    return Product.destroy({ where: { uuid } })
  }
}
