import { BadRequestException, Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/sequelize"
import { PromoCode } from "src/models/promoCode.model"
import { IPublicPromoCode } from "./types"
import { CreatePromoCodeDto } from "./dto/create-promoCode.dto"
import { Op } from "sequelize"

@Injectable()
export class PromoCodeService {
  constructor(
    @InjectModel(PromoCode)
    private readonly promoCodeModel: typeof PromoCode
  ) {}

  async get(name: string): Promise<IPublicPromoCode> {
    const promoCode = await PromoCode.findOne({ 
      where: {
        name: { [Op.like]: name },
        isDeleted: false,
        isDisabled: false
      }
    })

    this.validatePromoCode(promoCode)
  
    return {
      name: promoCode.name,
      uuid: promoCode.uuid,
      discount: promoCode.discount
    }
  }

  async getAll() {
    return PromoCode.findAll({
      where: {
        isDeleted: false,
      },
      order: [['createdAt', 'DESC']]
    })
  }

  
  async create(promoCode: CreatePromoCodeDto) {
    return PromoCode.create(promoCode, {
      returning: true
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

  validatePromoCode(promoCode: PromoCode) {
    if (!promoCode) {
      throw new BadRequestException('Promocode not found')
    }

    if (promoCode.existsUp && promoCode.existsUp < new Date()) {
      throw new BadRequestException('Expired promo code')
    }

    if (promoCode.quantity == 0) {
      throw new BadRequestException('Promo codes are over')
    }
  }
}
