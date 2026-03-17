import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { User } from './modules/users/entities/user.entity';
import { Model } from './modules/models/entities/model.entity';
import { ModelVersion } from './modules/models/entities/model-version.entity';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ModelsModule } from './modules/models/models.module';
import { StorageModule } from './storage/storage.module';
import { MaterialsModule } from './modules/materials/materials.module';
import { Material } from './modules/materials/entities/material.entity';
import { StlAnalyzerService } from './services/stl-analyzer.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',

      host: 'localhost',
      port: 5432,

      username: 'autoparts',
      password: 'autoparts',
      database: 'autoparts',

      entities: [User, Model, ModelVersion, Material],

      synchronize: true,
    }),

    UsersModule,
    AuthModule,
    ModelsModule,
    StorageModule,
    MaterialsModule,
  ],
  controllers: [AppController],
  providers: [AppService, StlAnalyzerService],
})
export class AppModule {}