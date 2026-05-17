import { Test, TestingModule } from '@nestjs/testing';
import { RequestsService } from './requests.service';
import { DataSource } from 'typeorm';
import { REDIS_CLIENT } from '../../redis/redis.module';

describe('RequestsService', () => {
  let service: RequestsService;

  const mockRedis = {
    publish: jest.fn(),
  };

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    setLock: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockRepository = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockManager = {
    getRepository: jest.fn(() => mockRepository),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn((cb) => cb(mockManager)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestsService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: REDIS_CLIENT,
          useValue: mockRedis,
        },
      ],
    }).compile();

    service = module.get<RequestsService>(RequestsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // happy path
  it('should create requests and publish redis event', async () => {
    const dto = {
      distributorId: 1,
      farmerIds: [1, 2],
      message: 'hello',
    };

    const farmers = [{ id: 1 }, { id: 2 }];

    mockQueryBuilder.getMany.mockResolvedValue(farmers);

    mockManager.create.mockImplementation((_, data) => data);

    const savedRequests = [
      { id: 1, farmer: { id: 1 } },
      { id: 2, farmer: { id: 2 } },
    ];

    mockManager.save.mockResolvedValue(savedRequests);

    const result = await service.createRequest(dto);

    // verify farmer lookup
    expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('farmer');

    expect(mockQueryBuilder.where).toHaveBeenCalledWith(
      'farmer.id IN (:...ids)',
      { ids: dto.farmerIds },
    );

    expect(mockQueryBuilder.setLock).toHaveBeenCalledWith(
      'pessimistic_write',
    );

    // verify entity creation
    expect(mockManager.create).toHaveBeenCalledTimes(2);

    // verify save
    expect(mockManager.save).toHaveBeenCalled();

    // verify redis publish
    expect(mockRedis.publish).toHaveBeenCalledWith(
      'request.created',
      JSON.stringify(savedRequests),
    );

    expect(result).toEqual(savedRequests);
  });

  // farmer not found
  it('should throw error if farmers are missing', async () => {
    const dto = {
      distributorId: 1,
      farmerIds: [1, 2],
      message: 'hello',
    };

    mockQueryBuilder.getMany.mockResolvedValue([{ id: 1 }]); // missing one farmer

    await expect(service.createRequest(dto)).rejects.toThrow(
      'One or more farmers not found',
    );

    expect(mockRedis.publish).not.toHaveBeenCalled();
    expect(mockManager.save).not.toHaveBeenCalled();
  });
});