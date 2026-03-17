import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Model } from './entities/model.entity';
import { ModelReview } from './entities/model-review.entity';
import { ModelVersion } from './entities/model-version.entity';

import { ModelsService } from './models.service';
import { ModelsController } from './models.controller';

import { StorageModule } from '../../storage/storage.module';
import { MaterialsModule } from '../materials/materials.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Model, ModelReview, ModelVersion]),
    StorageModule,
    MaterialsModule, // 🔥 ВАЖНО
  ],
  providers: [ModelsService],
  controllers: [ModelsController],
})
export class ModelsModule {}