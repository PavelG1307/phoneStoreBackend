import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/sequelize"
import { Category } from "src/models/category.model"

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category)
    private readonly categoryModel: typeof Category
  ) { }

  public static categories: Partial<Category>[] = [
    {
      uuid: '49097885-2d30-4c88-bc26-eb7db2c6d841',
      name: 'IPhone'
    },
    {
      uuid: '50041b06-4eb0-45c8-8c87-bdf0049b4aa7',
      name: 'IPad'
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
    },
    {
      uuid: '8aeba603-a913-4577-903d-f7187c5e5abc',
      name: 'Другие',
    },
    {
      uuid: 'ccc52d81-7c9c-4619-87ff-6ed7e363fea2',
      name: 'Samsung',
      parentUUID: '8aeba603-a913-4577-903d-f7187c5e5abc'
    },
    {
      uuid: 'e0844263-9fc4-4e72-8e3e-21f94bff72f4',
      name: 'Marshall',
      parentUUID: '8aeba603-a913-4577-903d-f7187c5e5abc'
    },
    {
      uuid: 'cf87ad6b-f3b3-41e4-ae78-7d69bbb7366b',
      name: 'DJI',
      parentUUID: '8aeba603-a913-4577-903d-f7187c5e5abc'
    },
    {
      uuid: '37c7f8bd-48a4-42af-8c27-740559f50e7b',
      name: 'Яндекс',
      parentUUID: '8aeba603-a913-4577-903d-f7187c5e5abc'
    },
    {
      uuid: 'afcd0861-edab-44b5-85dc-fd59bcd15233',
      name: 'Xiaomi',
      parentUUID: '8aeba603-a913-4577-903d-f7187c5e5abc'
    },
    {
      uuid: 'da8f765a-805d-49d3-b254-d496da65ee0c',
      name: 'Dreame',
      parentUUID: '8aeba603-a913-4577-903d-f7187c5e5abc'
    },
    {
      uuid: '0b5c1b8c-dace-47cd-bca2-17454d4ea135',
      name: 'JBL',
      parentUUID: '8aeba603-a913-4577-903d-f7187c5e5abc'
    },
  ]

  async getAll() {
    const products = Category.findAll()
    return products
  }

  async migrate() {
    
    const category = Category.bulkCreate(CategoryService.categories)
    return category
  }
}
