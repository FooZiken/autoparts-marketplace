import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Printer } from './entities/printer.entity';

import { PrintersService } from './printers.service';
import { PrintersController } from './printers.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Printer]),
  ],
  providers: [PrintersService],
  controllers: [PrintersController],
  exports: [PrintersService],
})
export class PrintersModule {}