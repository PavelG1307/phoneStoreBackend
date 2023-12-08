import { BadRequestException, Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/sequelize"
import { PromoCode } from "src/models/promocode.model"
import { IPublicPromoCode } from "./types"
import { CreatePromoCodeDto } from "./dto/create-promocode.dto"
import { Op } from "sequelize"
import { PromoCodeCategory } from "src/models/promocodeCategory.model"
import { PromoCodeFilter } from "./dto/get-promocode.dto"

@Injectable()
export class PromoCodeService {
  constructor(
    @InjectModel(PromoCode)
    private readonly promoCodeModel: typeof PromoCode
  ) {}

  async get(name: string, filter: PromoCodeFilter): Promise<IPublicPromoCode> {
    const promoCode = await PromoCode.findOne({ 
      where: {
        name: { [Op.like]: name },
        isDeleted: false,
        isDisabled: false
      },
      include: [PromoCodeCategory]
    })

    this.validatePromoCode(promoCode, filter)
  
    return {
      name: promoCode.name,
      uuid: promoCode.uuid,
      discount: promoCode.discount
    }
  }

  async getAll() {
    const promocodes = await PromoCode.findAll({
      where: {
        isDeleted: false,
      },
      order: [['createdAt', 'DESC']],
      include: [{ model: PromoCodeCategory, attributes: ['categoryUUID'] }],
    })
    return promocodes.map(promocode => ({
      uuid: promocode.uuid,
      name: promocode.name,
      discount: promocode.discount,
      existsUp: promocode.existsUp,
      quantity: promocode.quantity,
      isDisabled: promocode.isDisabled,
      categoryUuids: promocode.promoCodeCategories.map((pc) => pc.categoryUUID)
    }))
  }

  
  async create(promoCode: CreatePromoCodeDto) {
    const promoCodeCategories: PromoCodeCategory[] = promoCode.categoryUuids.map((uuid) => {
      return new PromoCodeCategory({
        categoryUUID: uuid
      })
    })
    return PromoCode.create({ ...promoCode, promoCodeCategories}, {
      returning: true,
      include: [PromoCodeCategory]
    })
  }

  async update(uuid: string, promoCode: Partial<PromoCode>) {
    await PromoCode.update(promoCode, {
      where: { uuid }
    })

    return this.getAll()
  }

  async delete(uuid: string) {
    const [count] = await PromoCode.update({
      isDeleted: true
    },
    {
      where: {
        uuid,
        isDeleted: false
      }
    })

    if (count !== 1) {
      throw new BadRequestException('Promocode not found')
    }
  }

  validatePromoCode(promoCode: PromoCode, filter: PromoCodeFilter) {
    console.log(promoCode, filter);
    
    if (!promoCode) {
      throw new BadRequestException('Promocode not found')
    }

    if (promoCode.existsUp && promoCode.existsUp < new Date()) {
      throw new BadRequestException('Expired promo code')
    }

    if (promoCode.quantity == 0) {
      throw new BadRequestException('Promo codes are over')
    }

    if (promoCode.promoCodeCategories.length !== 0 && (!filter.categoryUUIDs || filter.categoryUUIDs.length === 0)) {
      throw new BadRequestException('Please set categoryUUIDs')
    }

    if (promoCode.promoCodeCategories.length && !promoCode.promoCodeCategories.some(pc => filter.categoryUUIDs.includes(pc.categoryUUID))) {
      throw new BadRequestException('The promo code cannot be applied to these categories')
    }
  }
}
