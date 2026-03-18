import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';

import { OrdersService } from './orders.service';

import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
export class OrdersController {

  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() dto: any, @Request() req: any) {
    return this.ordersService.create(dto, req.user.id);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}