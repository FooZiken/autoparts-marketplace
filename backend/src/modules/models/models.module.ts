import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Model } from './entities/model.entity';
import { ModelReview } from './entities/model-review.entity';

import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Model,
      ModelReview
    ]),
  ],
  controllers: [ModelsController],
  providers: [ModelsService],
})
export class ModelsModule {}