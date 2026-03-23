import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Request,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { ModelsService } from './models.service';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';

import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

import { StorageService } from '../../storage/storage.service';

@Controller('models')
export class ModelsController {
  constructor(
    private readonly modelsService: ModelsService,
    private readonly storageService: StorageService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('designer')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateModelDto,
    @Request() req: any,
  ) {
    if (!file) {
      throw new Error('STL file is required');
    }

    const uploadResult = await this.storageService.uploadStl(file);

    return this.modelsService.create(
      dto,
      req.user.userId, // 🔥 FIX
      {
        stlKey: uploadResult.stlKey,
        width: uploadResult.width,
        height: uploadResult.height,
        depth: uploadResult.depth,
        volume: uploadResult.volume,
      },
    );
  }

  @Get()
  findAll(@Query() query: any) {
    return this.modelsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modelsService.findOne(id);
  }

  @Post(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('designer')
  update(@Param('id') id: string, @Body() dto: UpdateModelDto) {
    return this.modelsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('designer', 'admin')
  delete(@Param('id') id: string) {
    return this.modelsService.delete(id);
  }

  @Post(':id/approve')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  approve(@Param('id') id: string, @Request() req: any) {
    return this.modelsService.approveModel(id, req.user.userId); // 🔥 FIX
  }

  @Post(':id/reject')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  reject(@Param('id') id: string, @Request() req: any) {
    return this.modelsService.rejectModel(id, req.user.userId); // 🔥 FIX
  }

  @Get(':id/download')
  download(@Param('id') id: string) {
    return this.modelsService.downloadModel(id);
  }
}