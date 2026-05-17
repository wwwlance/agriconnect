import { Controller, Get, Query } from '@nestjs/common';

import { FarmersService } from './farmers.service';

@Controller('farmers')
export class FarmersController {
  constructor(private readonly farmersService: FarmersService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.farmersService.findAll(Number(page), Number(limit));
  }

  @Get('seed')
  async seed() {
    return this.farmersService.seedFarmers();
  }
}