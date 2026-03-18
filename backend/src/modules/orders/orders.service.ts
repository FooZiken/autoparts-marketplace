type EnrichedModel = {
  currentVersion: any;
  pricing: {
    total: number;
  };
  printer: any;
};
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Printer } from '../printers/entities/printer.entity';
import { Order } from './entities/order.entity';

import { ModelsService } from '../models/models.service';

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,

    private modelsService: ModelsService,
  ) {}

  async create(dto: any, buyerId: string) {

    let totalPrice = 0;
    let selectedPrinter: Printer | null = null;

    for (const modelId of dto.modelIds) {

      const model = await this.modelsService.findOne(modelId) as EnrichedModel;

      if (!model.currentVersion) {
        throw new NotFoundException('Model has no version');
      }

      totalPrice += model.pricing.total;

      // берём принтер первой модели (пока упрощение)
      if (!selectedPrinter && model.printer) {
        selectedPrinter = model.printer;
      }
    }

    if (!selectedPrinter) {
  throw new Error('Printer not selected');
}

const order = this.ordersRepository.create({
  buyerId,
  printerId: selectedPrinter.id,
  totalPrice,
  status: 'pending',
  deliveryAddress: dto.deliveryAddress,
});

    return this.ordersRepository.save(order);
  }

  async findAll() {
    return this.ordersRepository.find();
  }

  async findOne(id: string) {
    const order = await this.ordersRepository.findOne({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }
}