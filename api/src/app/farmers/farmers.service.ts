import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Farmer } from './farmer.entity';

@Injectable()
export class FarmersService {
  constructor(
    @InjectRepository(Farmer)
    private farmerRepository: Repository<Farmer>,
  ) {}

	async findAll(page = 1, limit = 10) {
		const [data, total] = await this.farmerRepository.findAndCount({
				skip: (page - 1) * limit,
				take: limit,
				order: {
						id: 'ASC',
				},
		});

		return {
			data,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
	}

	async seedFarmers() {
		const farmers = [];

		for (let i = 1; i <= 100; i++) {
			farmers.push(
				this.farmerRepository.create({
						name: `Farmer ${i}`,
						location: `Province ${i}`,
				}),
			);
		}

		return this.farmerRepository.save(farmers);
	}
}