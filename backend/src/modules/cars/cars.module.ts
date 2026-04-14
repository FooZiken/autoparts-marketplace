import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';

import { Brand } from './entities/brand.entity';
import { CarModel } from './entities/car-model.entity';
import { Body } from './entities/body.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Brand, CarModel, Body]),
  ],
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService],
})
export class CarsModule {}