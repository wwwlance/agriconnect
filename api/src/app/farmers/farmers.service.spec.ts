import { Test, TestingModule } from '@nestjs/testing';
import { FarmersService } from './farmers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Farmer } from './farmer.entity';

describe('FarmersService', () => {
  let service: FarmersService;

  const mockRepo = {
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmersService,
        {
          provide: getRepositoryToken(Farmer),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<FarmersService>(FarmersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  //find all paginated
  it('should return paginated farmers', async () => {
    const farmers = [
      { id: 1, name: 'Farmer 1' },
      { id: 2, name: 'Farmer 2' },
    ];

    mockRepo.findAndCount.mockResolvedValue([farmers, 2]);

    const result = await service.findAll(1, 10);

    expect(mockRepo.findAndCount).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      order: {
        id: 'ASC',
      },
    });

    expect(result).toEqual({
      data: farmers,
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
  });

  //edge case
  it('should handle empty farmers list', async () => {
    mockRepo.findAndCount.mockResolvedValue([[], 0]);

    const result = await service.findAll(1, 10);

    expect(result).toEqual({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    });
  });

  //seed
  it('should seed 100 farmers', async () => {
    const savedFarmers = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `Farmer ${i + 1}`,
      location: `Province ${i + 1}`,
    }));

    mockRepo.create.mockImplementation((dto) => dto);
    mockRepo.save.mockResolvedValue(savedFarmers);

    const result = await service.seedFarmers();

    expect(mockRepo.create).toHaveBeenCalledTimes(100);
    expect(mockRepo.save).toHaveBeenCalled();

    expect(result).toEqual(savedFarmers);
  });

  //seed validation
  it('should create correct farmer structure', async () => {
    mockRepo.create.mockImplementation((dto) => dto);
    mockRepo.save.mockResolvedValue([]);

    await service.seedFarmers();

    expect(mockRepo.create).toHaveBeenCalledWith({
      name: 'Farmer 1',
      location: 'Province 1',
    });
  });
});