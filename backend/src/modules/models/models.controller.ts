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
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Query } from '@nestjs/common';
import { QueryModelsDto } from './dto/query-models.dto';

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

  @Get(':id/download')
@UseGuards(AuthGuard('jwt'))
download(
  @Param('id') id: string
) {
  return this.modelsService.downloadModel(id);
}

 @Get()
findAll(
  @Query() query: QueryModelsDto
) {
  return this.modelsService.findAll(query);
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

  @Patch(':id/approve')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
approve(
  @Param('id') id: string,
  @Req() req,
) {

  const adminId = req.user.userId;

  return this.modelsService.approveModel(id, adminId);

}

@Patch(':id/reject')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
reject(
  @Param('id') id: string,
  @Req() req,
  @Body('comment') comment: string,
) {

  const adminId = req.user.userId;

  return this.modelsService.rejectModel(id, adminId, comment);

}

}