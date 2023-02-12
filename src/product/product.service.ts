import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/sequelize"
import { Op, WhereOptions } from "sequelize"
import { DEFAULT_LAZY_LOADING, DEFAULT_SORTING } from "src/core/constants"
import { Category } from "src/models/category.model"
import { StorageService } from "src/storage/storage.service"
import { Product } from "../models/product.model"
import { UUID } from "../models/types"
import { CreateProductDto } from "./dto/create-product.dto"
import { GetProductDto } from "./dto/get-product.dto"
import { iphones, ipads, macbooks, watchs } from './migrations/data'
@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product)
    private readonly productModel: typeof Product,
    private storageService: StorageService,
  ) { }

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
      order: [[orderBy || DEFAULT_SORTING.orderBy, order || DEFAULT_SORTING.order]],
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

  async migrate() {
    await this.migrateProducts(macbooks, '548606d6-5836-4e0f-b93e-4e772ca22076')
    await this.migrateProducts(iphones, '49097885-2d30-4c88-bc26-eb7db2c6d841')
    await this.migrateProducts(ipads, '50041b06-4eb0-45c8-8c87-bdf0049b4aa7')
    await this.migrateProducts(watchs, '4f3c7659-6cb4-4db9-93ec-a8975d681a20')
    return
  }

  async migrateProducts(products, categoryUUID) {
    for (const i in products) {
      const product = products[i]
      let isFirst = true
      const variants = await Promise.all(product?.variants.map(async (variant) => {
        const oldImageURLs = variant?.images.map(image => {
          const id = image?.id
          return `https://эплтрейд.рф/img/${id}_1920_q55.avif`
        })
        const images = await this.storageService.downloadAndUploadToCdnArray(oldImageURLs)
        console.log(`Загрузил ${images.length} фото`);
        const optionsIds = variant.option_values.map(option => option.value_id)
        const newVariant = {
          id: variant.id,
          optionsIds: optionsIds,
          optionsInfo: {
            price: variant?.price,
            images: images
          },
          isDefault: isFirst
        }
        isFirst = false
        return newVariant
      }))

      const options = product.options.map(option => {
        const items = option.values.map(value => {
          return {
            id: value.id,
            type: option?.data?.type || 'list',
            name: value.name === value.name,
            value: option?.data?.type === 'color' ? value?.data?.color : value.name
          }
        })
        return {
          name: option.name,
          type: items[0]?.type || 'list',
          items: items
        }
      })
      Product.create({
        name: product.name,
        description: product.description,
        categoryUUID: categoryUUID,
        images: product.images,
        price: product?.variants[0]?.price,
        priceOld: product?.variants[0]?.price_old,
        variants: variants,
        options: options
      })
    }
  }
}
