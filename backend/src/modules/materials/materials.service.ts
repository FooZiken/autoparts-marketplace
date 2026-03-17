import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Material } from './entities/material.entity';
import { CreateMaterialDto } from './dto/create-material.dto';

@Injectable()
export class MaterialsService {

  constructor(
    @InjectRepository(Material)
    private materialsRepository: Repository<Material>,
  ) {}

  async create(dto: CreateMaterialDto) {
    const material = this.materialsRepository.create(dto);
    return this.materialsRepository.save(material);
  }

  async findAll() {
    return this.materialsRepository.find();
  }

  async findOne(id: string) {
    const material = await this.materialsRepository.findOne({
      where: { id },
    });

    if (!material) {
      throw new NotFoundException('Material not found');
    }

    return material;
  }

  async delete(id: string) {
    const material = await this.findOne(id);
    return this.materialsRepository.remove(material);
  }
}