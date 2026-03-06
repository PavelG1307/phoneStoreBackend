import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/sequelize"
import { Op, WhereOptions } from "sequelize"
import { CategoryService } from "src/category/category.service"
import { DEFAULT_LAZY_LOADING, DEFAULT_SORTING_PRODUCT } from "src/core/constants"
import { Category } from "src/models/category.model"
import { Product } from "../models/product.model"
import { UUID } from "../models/types"
import { CreateProductDto } from "./dto/create-product.dto"
import { GetProductDto } from "./dto/get-product.dto"
import { PrometheumService } from "src/prometheus/prometheum.service"

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product,
    private readonly categoryService: CategoryService
  ) {}

  private static categoryAttributes = ['uuid', 'name', 'slug', 'parentUUID', 'isDeleted', 'createdAt', 'updatedAt'] as const

  async get(uuid: UUID) {
    const product = await this.productModel.findOne({
      where: { uuid },
      include: [{ model: Category, attributes: [...ProductService.categoryAttributes] }]
    })
    return product
  }

  async getAll(filters: GetProductDto) {
    const { productUUIDs, categoryUUID, categorySlug, limit, offset, orderBy, order } = filters
    const where: WhereOptions<Product> = {
      visible: true,
      isDeleted: false,
    }
    if (categorySlug) {
      const category = await this.categoryService.getBySlug(categorySlug)
      if (!category) return []
      where.categoryUUID = category.uuid
      PrometheumService.incUsersPerCategoryMetric(category.uuid)
    } else if (categoryUUID) {
      where.categoryUUID = categoryUUID
      PrometheumService.incUsersPerCategoryMetric(categoryUUID)
    }
    if (productUUIDs) where.uuid = {
      [Op.in]: productUUIDs
    }
    const products = this.productModel.findAll({
      where: { ...where },
      order: [[orderBy || DEFAULT_SORTING_PRODUCT.orderBy, order || DEFAULT_SORTING_PRODUCT.order], ['createdAt', 'DESC']],
      limit: Number(limit) || DEFAULT_LAZY_LOADING.limit,
      offset: Number(offset) || DEFAULT_LAZY_LOADING.offset,
      include: [{ model: Category, attributes: [...ProductService.categoryAttributes] }]
    })
    return products
  }

  
  async create(product: CreateProductDto) {
    const newProduct = await this.productModel.create(product, {
      returning: true
    })
    return newProduct
  }

  async update(uuid: string, product: Partial<Product>) {
    if (!uuid) {
      throw new BadRequestException('UUID - обязательный параметр')
    }
    const [count, updatedProduct] = await this.productModel.update(product, {
      where: { uuid },
      returning: true
    })
    if (count != 1) {
      throw new BadRequestException('Ошибка изменения товара')
    }
    return updatedProduct[0]
  }

  async delete(uuid: string) {
    if (!uuid) {
      throw new BadRequestException('UUID - обязательный параметр')
    }

    const product = await this.get(uuid)
    if (!product) {
      return new NotFoundException('Товар не найден')
    }
    product.isDeleted = true
    await product.save()
    return
  }
}
