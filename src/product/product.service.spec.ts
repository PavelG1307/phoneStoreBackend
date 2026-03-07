import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '../models/product.model';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';

const mockProductModel = {
  findOne: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: getModelToken(Product), useValue: mockProductModel },
      ],
    }).compile();
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create product', async () => {
    const TEST_PRODUCT: CreateProductDto = {
      name: 'Тестовый товар',
      price: 18999,
      categoryUUID: 'f5c3827f-ddc0-43db-9f4e-92a4d9c417e8',
      priceOld: 20000,
      description: 'Описание',
      visible: true,
      images: ['https://prodelo.biz/image/cache/catalog/attribute/tovar-1280x1280.jpeg'],
      optionIds: [1, 2],
      variants: [
        {
          id: 1,
          optionIds: [1],
          isDefault: true,
          optionInfo: {
            price: 23999
          }
        },
        {
          id: 2,
          optionIds: [2],
          isDefault: true,
          optionInfo: {
            price: 26734
          }
        }
      ]
    };
    const created = { ...TEST_PRODUCT, uuid: 'created-uuid' };
    mockProductModel.create.mockResolvedValue(created);

    const newProduct = await service.create(TEST_PRODUCT);

    expect(mockProductModel.create).toHaveBeenCalledWith(
      { ...TEST_PRODUCT, slug: 'testovyj-tovar' },
      { returning: true },
    );
    expect(newProduct).toHaveProperty('name', TEST_PRODUCT.name);
    expect(newProduct).toHaveProperty('price', TEST_PRODUCT.price);
  });
});