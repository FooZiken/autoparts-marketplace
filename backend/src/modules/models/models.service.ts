import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Model } from './entities/model.entity';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';

@Injectable()
export class ModelsService {

  constructor(
    @InjectRepository(Model)
    private modelsRepository: Repository<Model>,
  ) {}

  async create(createModelDto: CreateModelDto, designerId: string) {

    const model = this.modelsRepository.create({
      ...createModelDto,
      designerId,
      status: 'pending',
    });

    return this.modelsRepository.save(model);
  }

  async findAll() {
    return this.modelsRepository.find({
      where: { status: 'approved' },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {

    const model = await this.modelsRepository.findOne({
      where: { id },
    });

    if (!model) {
      throw new NotFoundException('Model not found');
    }

    return model;
  }

  async update(id: string, updateModelDto: UpdateModelDto) {

    const model = await this.findOne(id);

    Object.assign(model, updateModelDto);

    return this.modelsRepository.save(model);
  }

  async delete(id: string) {

    const model = await this.findOne(id);

    return this.modelsRepository.remove(model);
  }

}