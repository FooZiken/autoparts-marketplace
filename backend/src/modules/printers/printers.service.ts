import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Printer } from './entities/printer.entity';
import { CreatePrinterDto } from './dto/create-printer.dto';

@Injectable()
export class PrintersService {

  constructor(
    @InjectRepository(Printer)
    private printersRepository: Repository<Printer>,
  ) {}

  async create(dto: CreatePrinterDto) {
    const printer = this.printersRepository.create(dto);
    return this.printersRepository.save(printer);
  }

  async findAll() {
    return this.printersRepository.find();
  }

  async findOne(id: string) {
    const printer = await this.printersRepository.findOne({
      where: { id },
    });

    if (!printer) {
      throw new NotFoundException('Printer not found');
    }

    return printer;
  }

  async delete(id: string) {
    const printer = await this.findOne(id);
    return this.printersRepository.remove(printer);
  }

  async findSuitablePrinter(params: {
  width: number;
  height: number;
  depth: number;
  latitude: number;
  longitude: number;
}) {
  const printers = await this.printersRepository.find();

  // 1. фильтр по размеру
  const suitable = printers.filter((p) => {
    return (
      p.maxWidth >= params.width &&
      p.maxHeight >= params.height &&
      p.maxDepth >= params.depth
    );
  });

  if (suitable.length === 0) {
    throw new Error('No suitable printers found');
  }

  // 2. сортировка по расстоянию
  const sorted = suitable.sort((a, b) => {
    const distA = this.calculateDistance(
      params.latitude,
      params.longitude,
      a.latitude,
      a.longitude,
    );

    const distB = this.calculateDistance(
      params.latitude,
      params.longitude,
      b.latitude,
      b.longitude,
    );

    return distA - distB;
  });

  return sorted[0]; // ближайший
}

private calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  return Math.sqrt(
    Math.pow(lat1 - lat2, 2) +
    Math.pow(lon1 - lon2, 2),
  );
}

}