import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { Request } from './request.entity';
import { Farmer } from '../farmers/farmer.entity';
import { REDIS_CLIENT } from '../../redis/redis.module';
import type { RedisClientType } from 'redis';



@Injectable()
export class RequestsService {
  constructor(private dataSource: DataSource,
    @Inject(REDIS_CLIENT) private redis: RedisClientType
  ) {}

  async createRequest(dto: {
      distributorId: number;
      farmerIds: number[];
      message: string;
    }) {
    const { distributorId, farmerIds, message } = dto;

    return this.dataSource.transaction(async (manager) => {

      const farmers = await manager
        .getRepository(Farmer)
        .createQueryBuilder('farmer')
        .where('farmer.id IN (:...ids)', { ids: farmerIds })
        .setLock('pessimistic_write')
        .getMany();

      if (farmers.length !== farmerIds.length) {
        throw new Error('One or more farmers not found');
      }

      const requests = farmers.map((farmer) => {
        return manager.create(Request, {
          distributor: { id: distributorId },
          farmer: { id: farmer.id },
          message,
          status: 'PENDING',
        });
      });

      const savedRequests = await manager.save(requests);

      await this.redis.publish(
        'request.created',
        JSON.stringify(savedRequests),
      );

      return savedRequests;
      
    });
  }
}