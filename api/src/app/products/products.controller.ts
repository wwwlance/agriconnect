import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';

import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
  ) {}

  @Get('seed')
  async seed() {
    return this.productsService.seedProducts();
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('farmerId') farmerId?: number,
  ) {
    return this.productsService.findAll(
      Number(page),
      Number(limit),
      farmerId ? Number(farmerId) : undefined,
    );
  }
}