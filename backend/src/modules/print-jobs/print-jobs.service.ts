import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PrintJob } from './entities/print-job.entity';
import { Model } from '../models/entities/model.entity';
import { Material } from '../materials/entities/material.entity';
import { Printer } from '../printers/entities/printer.entity';
import { Order } from '../orders/entities/order.entity';
import { Executor } from '../executors/entities/executor.entity';

@Injectable()
export class PrintJobsService {
  constructor(
    @InjectRepository(PrintJob)
    private readonly repo: Repository<PrintJob>,
  ) {}

  async create(
    model: Model,
    material: Material,
    printer: Printer,
    volume: number,
    manufacturingCost: number,
  ): Promise<PrintJob> {
    const job = this.repo.create({
      model,
      material,
      printer,
      volume,
      manufacturingCost,
      status: 'pending',
    });

    return this.repo.save(job);
  }

  async attachToOrder(jobId: number, order: Order) {
    await this.repo.update(jobId, { order });
  }

  // 🔥 НОВЫЙ МЕТОД
  async assignExecutor(jobId: number, executor: Executor) {
    await this.repo.update(jobId, { executor });
  }

  async setSlicing(jobId: number) {
    await this.repo.update(jobId, { status: 'slicing' });
  }

  async setReady(jobId: number, gcodePath: string) {
    await this.repo.update(jobId, {
      status: 'ready',
      gcodePath,
    });
  }

  // 🔥 НОВЫЙ МЕТОД
  async setSentToExecutor(jobId: number) {
    await this.repo.update(jobId, {
      status: 'sent_to_executor',
    });
  }
}