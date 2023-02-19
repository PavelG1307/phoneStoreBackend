import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/sequelize"
import { Op, WhereOptions } from "sequelize"
import { DEFAULT_LAZY_LOADING, DEFAULT_SORTING_PRODUCT } from "src/core/constants"
import { Category } from "src/models/category.model"
import { Product } from "../models/product.model"
import { UUID } from "../models/types"
import { CreateProductDto } from "./dto/create-product.dto"
import { GetProductDto } from "./dto/get-product.dto"

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

  async getAll(filters: GetProductDto) {
    const { productUUIDs, categoryUUID, limit, offset, orderBy, order } = filters
    const where: WhereOptions<Product> = {
      visible: true
    }
    if (categoryUUID) where.categoryUUID = categoryUUID
    if (productUUIDs) where.uuid = {
      [Op.in]: productUUIDs
    }
    const products = Product.findAll({
      where: { ...where },
      order: [[orderBy || DEFAULT_SORTING_PRODUCT.orderBy, order || DEFAULT_SORTING_PRODUCT.order], ['createdAt', 'DESC']],
      limit: Number(limit) || DEFAULT_LAZY_LOADING.limit,
      offset: Number(offset) || DEFAULT_LAZY_LOADING.offset,
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
    return Product.update(product, {
      where: { uuid },
      returning: true
    })
  }

  async delete(uuid: string) {
    return Product.destroy({ where: { uuid } })
  }
}
