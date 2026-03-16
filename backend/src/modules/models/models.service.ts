import {
  Injectable,
  NotFoundException
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Model } from './entities/model.entity';
import { ModelReview } from './entities/model-review.entity';

import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { StorageService } from '../../storage/storage.service';

@Injectable()
export class ModelsService {

  constructor(
  @InjectRepository(Model)
  private modelsRepository: Repository<Model>,

  @InjectRepository(ModelReview)
  private reviewsRepository: Repository<ModelReview>,

  private storageService: StorageService,
) {}

  async create(createModelDto: CreateModelDto, designerId: string) {

    const model = this.modelsRepository.create({
      ...createModelDto,
      designerId,
      status: 'pending',
    });

    return this.modelsRepository.save(model);
  }

  async findAll(query: any) {

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;

  const skip = (page - 1) * limit;

  const qb = this.modelsRepository
    .createQueryBuilder('model')
    .where('model.status = :status', { status: 'approved' });

  if (query.search) {
    qb.andWhere(
      '(model.name ILIKE :search OR model.description ILIKE :search)',
      { search: `%${query.search}%` },
    );
  }

  if (query.priceFrom) {
    qb.andWhere('model.price >= :priceFrom', {
      priceFrom: query.priceFrom,
    });
  }

  if (query.priceTo) {
    qb.andWhere('model.price <= :priceTo', {
      priceTo: query.priceTo,
    });
  }

  if (query.sort === 'price') {
    qb.orderBy('model.price', 'ASC');
  } else {
    qb.orderBy('model.createdAt', 'DESC');
  }

  qb.skip(skip).take(limit);

  const [data, total] = await qb.getManyAndCount();

  return {
    data,
    total,
    page,
    limit,
  };
}

  async findOne(id: string) {

    const model = await this.modelsRepository.findOne({
      where: { id },
      relations: ['reviews'],
    });

    if (!model) {
      throw new NotFoundException('Model not found');
    }

    return model;

  }

  async update(id: string, updateModelDto: UpdateModelDto) {

    const model = await this.findOne(id);

    Object.assign(model, updateModelDto);

    model.status = 'pending';

    return this.modelsRepository.save(model);

  }

  async delete(id: string) {

    const model = await this.findOne(id);

    return this.modelsRepository.remove(model);

  }

  async approveModel(modelId: string, adminId: string, comment?: string) {

    const model = await this.findOne(modelId);

    model.status = 'approved';

    await this.modelsRepository.save(model);

    const review = this.reviewsRepository.create({
      modelId,
      adminId,
      status: 'approved',
      comment,
    });

    return this.reviewsRepository.save(review);

  }

  async rejectModel(modelId: string, adminId: string, comment?: string) {

    const model = await this.findOne(modelId);

    model.status = 'rejected';

    await this.modelsRepository.save(model);

    const review = this.reviewsRepository.create({
      modelId,
      adminId,
      status: 'rejected',
      comment,
    });

    return this.reviewsRepository.save(review);

  }

  async downloadModel(id: string) {

  const model = await this.findOne(id);

  if (model.status !== 'approved') {
    throw new NotFoundException('Model not available');
  }

  const url = await this.storageService.generateDownloadUrl(
    model.stlKey,
  );

  return {
    downloadUrl: url,
  };

}

}