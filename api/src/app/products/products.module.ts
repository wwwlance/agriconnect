import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { Farmer } from '../farmers/farmer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Farmer])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}