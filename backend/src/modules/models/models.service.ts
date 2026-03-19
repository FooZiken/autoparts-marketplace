import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrintersService } from '../printers/printers.service';
import { PricingService } from '../pricing/pricing.service';
import { Printer } from '../printers/entities/printer.entity';
import { Model } from './entities/model.entity';
import { ModelReview } from './entities/model-review.entity';
import { ModelVersion } from './entities/model-version.entity';

import { MaterialsService } from '../materials/materials.service';

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
    private materialsService: MaterialsService,
    private pricingService: PricingService,
    private printersService: PrintersService,
  ) {}

  // CREATE
  async create(
  createModelDto: CreateModelDto,
  designerId: string,
  fileData: {
    stlKey: string;
    width?: number;
    height?: number;
    depth?: number;
    volume?: number;
  },
)
  {
    await this.materialsService.findOne(createModelDto.materialId);

    const model = this.modelsRepository.create({
      name: createModelDto.name,
      description: createModelDto.description,
      designerId,
      status: 'pending',
    });

    const savedModel = await this.modelsRepository.save(model);

    const version = this.versionRepo.create({
  model: savedModel,
  version: 1,
  stlKey: fileData.stlKey,
  price: createModelDto.price,
  materialId: createModelDto.materialId,

  width: fileData.width ?? null,
  height: fileData.height ?? null,
  depth: fileData.depth ?? null,
  volume: fileData.volume ?? null,
} as Partial<ModelVersion>);

    await this.versionRepo.save(version);

    return savedModel;
  }

  // LIST
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

  // 🔥 GET ONE С PRICING
  async findOne(id: string) {
  const model = await this.modelsRepository.findOne({
    where: { id },
    relations: ['reviews', 'versions'],
  });

  if (!model) {
    throw new NotFoundException('Model not found');
  }

  const latest = model.versions?.sort(
    (a, b) => b.version - a.version,
  )[0];

  if (!latest) {
  throw new NotFoundException('Model has no versions');
}

  // 🔥 MATERIAL
  const material = await this.materialsService.findOne(
    latest.materialId,
  );

  const materialMultiplier = material.priceMultiplier;

  // 🔥 PRICING
  const pricing = this.pricingService.calculateTotalPrice({
    volume: latest.volume,
    materialMultiplier,
    designerPrice: Number(latest.price),
  });

  // 🔥 PRINTER (временно координаты фиксированные)
  let printer: Printer | null = null;

  try {
    printer = await this.printersService.findSuitablePrinter({
      width: latest.width,
      height: latest.height,
      depth: latest.depth,
      latitude: 55.75,  // Москва (пока заглушка)
      longitude: 37.61,
    });
  } catch (e) {
    printer = null;
  }

  return {
    ...model,
    currentVersion: latest,
    pricing,
    printer,
  };
}

  // UPDATE
  async update(id: string, dto: UpdateModelDto) {
    const model = await this.findOne(id);

    const lastVersion = await this.versionRepo.findOne({
      where: { model: { id } },
      order: { version: 'DESC' },
    });

    if (!lastVersion) {
      throw new NotFoundException('Model version not found');
    }

    if (dto.materialId) {
      await this.materialsService.findOne(dto.materialId);
    }

    const newVersion = this.versionRepo.create({
      model: model,
      version: lastVersion.version + 1,
      stlKey: dto.stlKey || lastVersion.stlKey,
      price: dto.price ?? lastVersion.price,
      materialId: dto.materialId ?? lastVersion.materialId,

      width: lastVersion.width,
      height: lastVersion.height,
      depth: lastVersion.depth,
      volume: lastVersion.volume,
    } as Partial<ModelVersion>);

    await this.versionRepo.save(newVersion);

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