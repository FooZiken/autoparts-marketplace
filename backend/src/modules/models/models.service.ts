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
import { CarsService } from '../cars/cars.service';

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
    private carsService: CarsService,
  ) {}

  // ================= CREATE =================
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
    imageKeys: string[] = [],
  ) {
    await this.materialsService.findOne(createModelDto.materialId);

    const model = this.modelsRepository.create({
      name: createModelDto.name,
      description: createModelDto.description,
      designerId,
      status: 'pending',

      brandId: createModelDto.brandId ?? null,
      carModelId: createModelDto.carModelId ?? null,
      bodyId: createModelDto.bodyId ?? null,
      oemNumber: createModelDto.oemNumber ?? null,
      isCustomPart: createModelDto.isCustomPart ?? false,
      isTested: createModelDto.isTested ?? false,

      images: imageKeys,
    } as Partial<Model>);

    const savedModel = await this.modelsRepository.save(model);

    const version: ModelVersion = this.versionRepo.create({
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

  // ================= LIST =================
  async findAll(query: any) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const skip = (page - 1) * limit;

    const qb = this.modelsRepository
      .createQueryBuilder('model')
      .leftJoinAndSelect('model.versions', 'version')
      .where('model.status = :status', { status: 'approved' });

    if (query.search && query.search.trim() !== '') {
      qb.andWhere(
        '(model.name ILIKE :search OR model.description ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    if (query.brandId) {
  qb.andWhere('model.brandId = :brandId', {
    brandId: query.brandId,
  });
}

if (query.carModelId) {
  qb.andWhere('model.carModelId = :carModelId', {
    carModelId: query.carModelId,
  });
}

if (query.bodyId) {
  qb.andWhere('model.bodyId = :bodyId', {
    bodyId: query.bodyId,
  });
}

    qb.orderBy('model.createdAt', 'DESC');
    qb.skip(skip).take(limit);

    const [models, total] = await qb.getManyAndCount();

    const mapped = models.map((model) => {
      const versions = Array.isArray(model.versions)
        ? model.versions
        : [];

      const latest = versions.length
        ? versions.sort((a, b) => b.version - a.version)[0]
        : null;

      return {
        ...model,
        currentVersion: latest,
      };
    });

    const enriched = await this.enrichModels(mapped);

    return {
      data: enriched,
      total,
      page,
      limit,
    };
  }

  // ================= GET ONE =================
  async findOne(id: string) {
    const model = await this.modelsRepository.findOne({
      where: { id },
      relations: ['reviews', 'versions'],
    });

    if (!model) {
      throw new NotFoundException('Model not found');
    }

    const versions = Array.isArray(model.versions)
      ? model.versions
      : [];

    const latest = versions.length
      ? versions.sort((a, b) => b.version - a.version)[0]
      : null;

    if (!latest) {
      throw new NotFoundException('Model has no versions');
    }

    const material = await this.materialsService.findOne(
      latest.materialId,
    );

    const pricing = this.pricingService.calculateTotalPrice({
      volume: latest.volume,
      materialMultiplier: material.priceMultiplier,
      designerPrice: Number(latest.price),
    });

    let printer: Printer | null = null;

    try {
      printer = await this.printersService.findSuitablePrinter({
        width: latest.width,
        height: latest.height,
        depth: latest.depth,
        latitude: 55.75,
        longitude: 37.61,
      });
    } catch {
      printer = null;
    }

    const enriched = await this.enrichModels([
      {
        ...model,
        currentVersion: latest,
      },
    ]);

    return {
      ...enriched[0],
      pricing,
      printer,
    };
  }

  // ================= ENRICH =================
  private async enrichModels(models: any[]) {
    const [brands, carModels, bodies, materials] =
      await Promise.all([
        this.carsService.findBrands(),
        this.carsService.findModels(),
        this.carsService.findBodies(),
        this.materialsService.findAll(),
      ]);

    const brandMap = new Map(brands.map(b => [b.id, b]));
    const modelMap = new Map(carModels.map(m => [m.id, m]));
    const bodyMap = new Map(bodies.map(b => [b.id, b]));
    const materialMap = new Map(materials.map(m => [m.id, m]));

    return models.map((m) => {
      const material = materialMap.get(
        m.currentVersion?.materialId
      );

      const brand = brandMap.get(m.brandId);
      const carModel = modelMap.get(m.carModelId);
      const body = bodyMap.get(m.bodyId);

      return {
        ...m,

        material: material
          ? { id: material.id, name: material.name }
          : null,

        car: {
          brand: brand?.name || null,
          model: carModel?.name || null,
          body: body
            ? `${body.name} (${body.productionStart}-${body.productionEnd})`
            : null,
        },

        images: (m.images || []).map(
  (key: string) =>
    `http://localhost:3000/models/image/${key}`
),
      };
    });
  }

  // ================= MY MODELS =================
async getMyModels(userId: string, query: any) {
  const qb = this.modelsRepository
    .createQueryBuilder('model')
    .leftJoinAndSelect('model.versions', 'version')
    .where('model.designerId = :userId', { userId });

  if (query.search && query.search.trim() !== '') {
    qb.andWhere(
      '(model.name ILIKE :search OR model.description ILIKE :search)',
      { search: `%${query.search}%` },
    );
  }

  if (query.status && query.status !== 'all') {
    qb.andWhere('model.status = :status', {
      status: query.status,
    });
  }

  qb.orderBy('model.createdAt', 'DESC');

  const models = await qb.getMany();

  const mapped = models.map((model) => {
    const versions = Array.isArray(model.versions)
      ? model.versions
      : [];

    const latest = versions.length
      ? versions.sort((a, b) => b.version - a.version)[0]
      : null;

    return {
      ...model,
      currentVersion: latest,
    };
  });

  const enriched = await this.enrichModels(mapped);

  return {
    data: enriched,
    total: enriched.length,
  };
}

// ================= UPDATE =================
async update(id: string, dto: UpdateModelDto) {
  const model = await this.modelsRepository.findOne({
    where: { id },
  });

  if (!model) {
    throw new NotFoundException('Model not found');
  }

  Object.assign(model, dto);

  return this.modelsRepository.save(model);
}

// ================= DELETE =================
async delete(id: string) {
  const model = await this.modelsRepository.findOne({
    where: { id },
  });

  if (!model) {
    throw new NotFoundException('Model not found');
  }

  await this.modelsRepository.remove(model);

  return { success: true };
}

// ================= APPROVE =================
async approveModel(id: string, userId: string) {
  const model = await this.modelsRepository.findOne({
    where: { id },
  });

  if (!model) {
    throw new NotFoundException('Model not found');
  }

  model.status = 'approved';

  return this.modelsRepository.save(model);
}

// ================= REJECT =================
async rejectModel(id: string, userId: string) {
  const model = await this.modelsRepository.findOne({
    where: { id },
  });

  if (!model) {
    throw new NotFoundException('Model not found');
  }

  model.status = 'rejected';

  return this.modelsRepository.save(model);
}

// ================= DOWNLOAD =================
async downloadModel(id: string, userId: string) {
  const model = await this.modelsRepository.findOne({
    where: { id },
    relations: ['versions'],
  });

  if (!model) {
    throw new NotFoundException('Model not found');
  }

  const versions = model.versions || [];

  const latest = versions.length
    ? versions.sort((a, b) => b.version - a.version)[0]
    : null;

  if (!latest) {
    throw new NotFoundException('No STL found');
  }

  // 🔥 проверка через printJobs
  const qb = this.versionRepo
    .createQueryBuilder('version')
    .leftJoin('version.model', 'model')
    .leftJoin('print_jobs', 'pj', 'pj.modelVersionId = version.id')
    .leftJoin('executor', 'executor', 'executor.id = pj.executorId')
    .where('model.id = :modelId', { modelId: id })
    .andWhere('executor.id = :userId', { userId });

  const hasAccess = await qb.getOne();

  if (!hasAccess) {
    throw new NotFoundException('Access denied');
  }

  const url = await this.storageService.generateDownloadUrl(
    latest.stlKey,
  );

  return { url };
}

async getFilterOptions() {
  const qb = this.modelsRepository
    .createQueryBuilder('model')
    .where('model.status = :status', { status: 'approved' });

  const models = await qb.getMany();

  const brandIds = new Set<string>();
  const modelIds = new Set<string>();
  const bodyIds = new Set<string>();

  models.forEach((m) => {
    if (m.brandId) brandIds.add(m.brandId);
    if (m.carModelId) modelIds.add(m.carModelId);
    if (m.bodyId) bodyIds.add(m.bodyId);
  });

  const [brands, carModels, bodies] = await Promise.all([
    this.carsService.findBrands(),
    this.carsService.findModels(),
    this.carsService.findBodies(),
  ]);

  return {
    brands: brands.filter((b) => brandIds.has(b.id)),
    models: carModels.filter((m) => modelIds.has(m.id)),
    bodies: bodies.filter((b) => bodyIds.has(b.id)),
  };
}
}