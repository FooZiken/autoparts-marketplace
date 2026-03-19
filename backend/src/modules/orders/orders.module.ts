import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';

import { ModelsModule } from '../models/models.module';
import { PrintJobsModule } from '../print-jobs/print-jobs.module';
import { ExecutorsModule } from '../executors/executors.module';

import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    ModelsModule,
    PrintJobsModule,
    ExecutorsModule,

    BullModule.registerQueue({
      name: 'slicing',
    }),
  ],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}