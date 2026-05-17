import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Farmer } from '../farmers/farmer.entity';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };

  const mockProductRepo = {
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockFarmerRepo = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepo,
        },
        {
          provide: getRepositoryToken(Farmer),
          useValue: mockFarmerRepo,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  //seeding
  it('should seed products for farmers', async () => {
    const farmers = [{ id: 1 }, { id: 2 }];

    mockFarmerRepo.find.mockResolvedValue(farmers);

    mockProductRepo.create.mockImplementation((dto) => dto);
    mockProductRepo.save.mockResolvedValue('saved-products');

    const result = await service.seedProducts();

    expect(mockFarmerRepo.find).toHaveBeenCalled();
    expect(mockProductRepo.create).toHaveBeenCalled();
    expect(mockProductRepo.save).toHaveBeenCalled();

    expect(result).toBe('saved-products');
  });

  //empty table
  it('should return message when no farmers exist', async () => {
    mockFarmerRepo.find.mockResolvedValue([]);

    const result = await service.seedProducts();

    expect(result).toEqual({
      message: 'No farmers found',
    });
  });

  //pagination
  it('should return paginated products', async () => {
    mockQueryBuilder.getManyAndCount.mockResolvedValue([
      [{ id: 1 }, { id: 2 }],
      2,
    ]);

    const result = await service.findAll(1, 10);

    expect(mockProductRepo.createQueryBuilder).toHaveBeenCalledWith('product');

    expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
      'product.farmer',
      'farmer',
    );

    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
      'product.id',
      'ASC',
    );

    expect(result).toEqual({
      data: [{ id: 1 }, { id: 2 }],
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  });

  //filter by farmer
  it('should filter products by farmerId', async () => {
    mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

    await service.findAll(1, 10, 5);

    expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
      'farmer.id = :farmerId',
      { farmerId: 5 },
    );
  });
});