import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/sequelize"
import { Category } from "src/models/category.model"

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private readonly categoryModel: typeof Category
  ) { }

  async getAll() {
    const products = Category.findAll()
    return products
  }

  async migrate() {
    const categories: Partial<Category>[] = [
      {
        uuid: '49097885-2d30-4c88-bc26-eb7db2c6d841',
        name: 'Iphone'
      },
      {
        uuid: '50041b06-4eb0-45c8-8c87-bdf0049b4aa7',
        name: 'Ipad'
      },
      {
        uuid: '548606d6-5836-4e0f-b93e-4e772ca22076',
        name: 'Mac'
      },
      {
        uuid: '4f3c7659-6cb4-4db9-93ec-a8975d681a20',
        name: 'Watch'
      },
      {
        uuid: 'c22124cd-f6f0-4e4a-b898-c1606f1c8e25',
        name: 'AirPods'
      },
      {
        uuid: '7342f370-a98b-485c-bcb9-41b6a1fd3318',
        name: 'Аксессуары'
      },
      {
        uuid: 'b735980b-2c69-4450-bfac-69dd7ee60e44',
        name: 'Dyson'
      },
      {
        uuid: '12411ad6-f511-4812-b7a3-b3e41de95a64',
        name: 'PS5'
      },
      {
        uuid: '9c4fc64f-6545-4c8b-9745-e900e506082a',
        name: 'Зарядные блоки',
        parentUUID: 'c22124cd-f6f0-4e4a-b898-c1606f1c8e25'
      },
      {
        uuid: '3c28df49-c662-469e-90df-888724e24da1',
        name: 'Чехлы',
        parentUUID: 'c22124cd-f6f0-4e4a-b898-c1606f1c8e25'
      }
    ]
    const category = Category.bulkCreate(categories)
    return category
  }
}
