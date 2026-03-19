import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

import { PrintJob } from '../print-jobs/entities/print-job.entity';
import { Order } from './entities/order.entity';
import { ModelsService } from '../models/models.service';
import { PrintJobsService } from '../print-jobs/print-jobs.service';
import { ExecutorsService } from '../executors/executors.service';

type EnrichedModel = {
  currentVersion: any;
  pricing: {
    total: number;
    manufacturingCost?: number;
  };
  printer: any;
  material?: any;
  volume?: number;
};

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,

    private modelsService: ModelsService,
    private printJobsService: PrintJobsService,
    private executorsService: ExecutorsService,

    @InjectQueue('slicing')
    private slicingQueue: Queue,
  ) {}

  async create(dto: any, buyerId: string) {

    let totalPrice = 0;
    const printJobs: PrintJob[] = [];

    for (const modelId of dto.modelIds) {

      const model = await this.modelsService.findOne(modelId) as EnrichedModel;

      if (!model.currentVersion) {
        throw new NotFoundException('Model has no version');
      }

      totalPrice += model.pricing.total;

      if (!model.printer) {
        throw new Error('Printer not selected');
      }

      // 🔥 создаём PrintJob
      const printJob = await this.printJobsService.create(
        model.currentVersion,
        model.material,
        model.printer,
        model.volume || 0,
        model.pricing.manufacturingCost || 0,
      );

      // 🔥 назначаем исполнителя
      const executor = await this.executorsService.findSuitableExecutor(
  model.printer,
);

if (executor) {
  await this.printJobsService.assignExecutor(printJob.id, executor);
}

      printJobs.push(printJob);
    }

    const order = this.ordersRepository.create({
      buyerId,
      totalPrice,
      status: 'pending',
      deliveryAddress: dto.deliveryAddress,
    });

    const savedOrder = await this.ordersRepository.save(order);

    // 🔥 сохраняем связи + отправляем в очередь
    for (const job of printJobs) {
      await this.printJobsService.attachToOrder(job.id, savedOrder);

      await this.slicingQueue.add('slice', {
        printJobId: job.id,
      });
    }

    return {
      order: savedOrder,
      printJobs,
    };
  }

  async findAll() {
    return this.ordersRepository.find({
      relations: ['printJobs'],
    });
  }

  async findOne(id: string) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['printJobs'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}