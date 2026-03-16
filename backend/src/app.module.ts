import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { User } from './modules/users/entities/user.entity';
import { Model } from './modules/models/entities/model.entity';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ModelsModule } from './modules/models/models.module';
import { StorageModule } from './storage/storage.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',

      host: 'localhost',
      port: 5432,

      username: 'autoparts',
      password: 'autoparts',
      database: 'autoparts',

      entities: [User, Model],

      synchronize: true,
    }),

    UsersModule,
    AuthModule,
    ModelsModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}