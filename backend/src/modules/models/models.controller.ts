import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Req,
  UseGuards
} from '@nestjs/common';

import { ModelsService } from './models.service';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';

import { AuthGuard } from '@nestjs/passport';

@Controller('models')
export class ModelsController {

  constructor(private readonly modelsService: ModelsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body() createModelDto: CreateModelDto,
    @Req() req
  ) {

    const designerId = req.user.userId;

    return this.modelsService.create(createModelDto, designerId);
  }

  @Get()
  findAll() {
    return this.modelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modelsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body() updateModelDto: UpdateModelDto
  ) {
    return this.modelsService.update(id, updateModelDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.modelsService.delete(id);
  }

}