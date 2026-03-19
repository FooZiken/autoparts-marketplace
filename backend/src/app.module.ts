import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';

import { OrdersModule } from './modules/orders/orders.module';
import { Order } from './modules/orders/entities/order.entity';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ModelReview } from './modules/models/entities/model-review.entity';
import { User } from './modules/users/entities/user.entity';
import { Model } from './modules/models/entities/model.entity';
import { ModelVersion } from './modules/models/entities/model-version.entity';

import { PrintersModule } from './modules/printers/printers.module';
import { Printer } from './modules/printers/entities/printer.entity';
import { Executor } from './modules/executors/entities/executor.entity';
import { ExecutorsModule } from './modules/executors/executors.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ModelsModule } from './modules/models/models.module';
import { StorageModule } from './storage/storage.module';
import { MaterialsModule } from './modules/materials/materials.module';
import { Material } from './modules/materials/entities/material.entity';
import { PrintJob } from './modules/print-jobs/entities/print-job.entity';
import { PricingModule } from './modules/pricing/pricing.module';
import { PrintJobsModule } from './modules/print-jobs/print-jobs.module';
import { SlicingModule } from './modules/slicing/slicing.module';

@Module({
  imports: [
    // 🔥 БД
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'autoparts',
      password: 'autoparts',
      database: 'autoparts',
      entities: [
        User,
        Model,
        ModelVersion,
        ModelReview,
        Material,
        Printer,
        Order,
        PrintJob,
        Executor,
      ],
      synchronize: true,
    }),

    // 🔥 REDIS + QUEUE
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),

    // 🔥 модули
    UsersModule,
    AuthModule,
    ModelsModule,
    StorageModule,
    MaterialsModule,
    PricingModule,
    PrintersModule,
    OrdersModule,
    PrintJobsModule,
    SlicingModule,
    ExecutorsModule, // 👈 новый
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}