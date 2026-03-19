import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Executor } from './entities/executor.entity';
import { Repository } from 'typeorm';
import { Printer } from '../printers/entities/printer.entity';

@Injectable()
export class ExecutorsService {
  constructor(
    @InjectRepository(Executor)
    private repo: Repository<Executor>,
  ) {}

  async findSuitableExecutor(printer: Printer): Promise<Executor | null> {
    const executors = await this.repo.find({
      relations: ['printers'],
      where: {
        isActive: true,
      },
    });

    // простая логика: ищем исполнителя с этим принтером
    for (const executor of executors) {
      const hasPrinter = executor.printers.some(
        (p) => p.id === printer.id,
      );

      if (hasPrinter) {
        return executor;
      }
    }

    return null;
  }
}