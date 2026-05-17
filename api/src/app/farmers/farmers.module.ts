import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FarmersController } from './farmers.controller';
import { Farmer } from './farmer.entity';
import { FarmersService } from './farmers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Farmer])],
  controllers: [FarmersController],
  providers: [FarmersService],
})
export class FarmersModule {}