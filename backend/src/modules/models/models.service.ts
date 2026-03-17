import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Model } from './entities/model.entity';
import { ModelReview } from './entities/model-review.entity';
import { ModelVersion } from './entities/model-version.entity';

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

    @InjectRepository(ModelVersion)
    private versionRepo: Repository<ModelVersion>,

    private storageService: StorageService,
  ) {}

  // ✅ CREATE MODEL + FIRST VERSION
  async create(createModelDto: CreateModelDto, designerId: string) {
    const model = this.modelsRepository.create({
      name: createModelDto.name,
      description: createModelDto.description,
      designerId,
      status: 'pending',
    });

    const savedModel = await this.modelsRepository.save(model);

    const version = this.versionRepo.create({
      modelId: savedModel.id,
      version: 1,
      stlKey: createModelDto.stlKey,
      price: createModelDto.price,
      material: createModelDto.material,
    });

    await this.versionRepo.save(version);

    return savedModel;
  }

  // ✅ FIND ALL WITH VERSIONING
  async findAll(query: any) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const skip = (page - 1) * limit;

    const qb = this.modelsRepository
      .createQueryBuilder('model')
      .leftJoinAndSelect('model.versions', 'version')
      .where('model.status = :status', { status: 'approved' });

    if (query.search) {
      qb.andWhere(
        '(model.name ILIKE :search OR model.description ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    qb.orderBy('model.createdAt', 'DESC');
    qb.skip(skip).take(limit);

    const [models, total] = await qb.getManyAndCount();

    const data = models.map((model) => {
      const latest = model.versions?.sort(
        (a, b) => b.version - a.version,
      )[0];

      return {
        ...model,
        currentVersion: latest,
      };
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  // ✅ FIND ONE (WITH VERSIONS)
  async findOne(id: string) {
    const model = await this.modelsRepository.findOne({
      where: { id },
      relations: ['reviews', 'versions'],
    });

    if (!model) {
      throw new NotFoundException('Model not found');
    }

    return model;
  }

  // ✅ UPDATE = NEW VERSION
  async update(id: string, updateModelDto: UpdateModelDto) {
    const model = await this.findOne(id);

    const lastVersion = await this.versionRepo.findOne({
      where: { modelId: id },
      order: { version: 'DESC' },
    });

    const newVersion = this.versionRepo.create({
      modelId: id,
      version: (lastVersion?.version || 0) + 1,
      stlKey: updateModelDto.stlKey || lastVersion?.stlKey,
      price: updateModelDto.price ?? lastVersion?.price,
      material: updateModelDto.material ?? lastVersion?.material,
    });

    await this.versionRepo.save(newVersion);

    model.status = 'pending';

    return this.modelsRepository.save(model);
  }

  // ✅ DELETE
  async delete(id: string) {
    const model = await this.findOne(id);
    return this.modelsRepository.remove(model);
  }

  // ✅ APPROVE
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

  // ✅ REJECT
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

  // ❗ ВРЕМЕННО оставляем, но потом удалим (STL нельзя отдавать)
  async downloadModel(id: string) {
    const model = await this.findOne(id);

    if (model.status !== 'approved') {
      throw new NotFoundException('Model not available');
    }

    const latest = model.versions?.sort(
      (a, b) => b.version - a.version,
    )[0];

    const url = await this.storageService.generateDownloadUrl(
      latest.stlKey,
    );

    return {
      downloadUrl: url,
    };
  }
}