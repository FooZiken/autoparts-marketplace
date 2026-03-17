import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Model } from './entities/model.entity';
import { ModelReview } from './entities/model-review.entity';

import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';
import { ModelVersion } from './entities/model-version.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Model,
      ModelVersion,
      ModelReview
    ]),
  ],
  controllers: [ModelsController],
  providers: [ModelsService],
})
export class ModelsModule {}