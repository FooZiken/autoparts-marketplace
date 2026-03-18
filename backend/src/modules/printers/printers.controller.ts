import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { PrintersService } from './printers.service';
import { CreatePrinterDto } from './dto/create-printer.dto';

import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('printers')
export class PrintersController {

  constructor(private readonly printersService: PrintersService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  create(@Body() dto: CreatePrinterDto) {
    return this.printersService.create(dto);
  }

  @Get()
  findAll() {
    return this.printersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.printersService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  delete(@Param('id') id: string) {
    return this.printersService.delete(id);
  }
}