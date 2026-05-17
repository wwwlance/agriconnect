import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './product.entity';
import { Farmer } from '../farmers/farmer.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(Farmer)
    private farmerRepository: Repository<Farmer>,
  ) {}

  async seedProducts() {
    const farmers = await this.farmerRepository.find();

    if (!farmers.length) {
      return {
        message: 'No farmers found',
      };
    }

    const products: Product[] = [];

    for (const farmer of farmers) {
      for (let i = 1; i <= 5; i++) {
        const product = this.productRepository.create({
          name: `Product ${i} of Farmer ${farmer.id}`,
          price: Number((Math.random() * 100).toFixed(2)),
          imageUrl: `https://cdn.agriconnect.com/products/${i}.jpg`,
          farmer,
        });

        products.push(product);
      }
    }

    return this.productRepository.save(products);
  }

  async findAll(
    page = 1,
    limit = 10,
    farmerId?: number,
  ) {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.farmer', 'farmer')
      .orderBy('product.id', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    if (farmerId) {
      query.andWhere('farmer.id = :farmerId', {
        farmerId,
      });
    }

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}