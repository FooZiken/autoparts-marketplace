import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Brand } from './entities/brand.entity';
import { CarModel } from './entities/car-model.entity';
import { Body } from './entities/body.entity';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Brand)
    private brandRepo: Repository<Brand>,

    @InjectRepository(CarModel)
    private modelRepo: Repository<CarModel>,

    @InjectRepository(Body)
    private bodyRepo: Repository<Body>,
  ) {}

  findBrands() {
    return this.brandRepo.find({
      order: { name: 'ASC' },
    });
  }

  findModels(brandId?: string) {
    const qb = this.modelRepo.createQueryBuilder('model');

    if (brandId) {
      qb.where('model.brandId = :brandId', { brandId });
    }

    return qb.orderBy('model.name', 'ASC').getMany();
  }

  findBodies(modelId?: string) {
    const qb = this.bodyRepo.createQueryBuilder('body');

    if (modelId) {
      qb.where('body.carModelId = :modelId', { modelId });
    }

    return qb.orderBy('body.productionStart', 'ASC').getMany();
  }
}