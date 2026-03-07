import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "@nestjs/sequelize"
import { Op, WhereOptions } from "sequelize"
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
    private readonly productModel: typeof Product
  ) {}

  private static categoryAttributes = ['uuid', 'name', 'parentUUID', 'isDeleted', 'createdAt', 'updatedAt'] as const

  private static readonly CYRILLIC_TO_LATIN: Record<string, string> = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z',
    'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
    'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
    'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  }

  /**
   * Генерирует URL-слаг из имени: кириллица в латиницу, нижний регистр, пробелы и спецсимволы — в дефисы.
   */
  private slugify(name: string): string {
    const lower = name.trim().toLowerCase()
    const transliterated = lower.split('').map((char) => {
      return ProductService.CYRILLIC_TO_LATIN[char] ?? char
    }).join('')
    const slug = transliterated
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    return slug || 'product'
  }

  private async ensureUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug
    let counter = 0
    while (true) {
      const existing = await this.productModel.findOne({ where: { slug } })
      if (!existing) return slug
      counter += 1
      slug = `${baseSlug}-${counter}`
    }
  }

  async get(uuid: UUID) {
    const product = await this.productModel.findOne({
      where: { uuid },
      include: [{ model: Category, attributes: [...ProductService.categoryAttributes] }]
    })
    return product
  }

  async getAll(filters: GetProductDto) {
    const { productUUIDs, categoryUUID, limit, offset, orderBy, order } = filters
    const where: WhereOptions<Product> = {
      visible: true,
      isDeleted: false,
    }
    if (categoryUUID) {
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
    const slug = await this.ensureUniqueSlug(this.slugify(product.name))
    const newProduct = await this.productModel.create(
      { ...product, slug },
      { returning: true }
    )
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
