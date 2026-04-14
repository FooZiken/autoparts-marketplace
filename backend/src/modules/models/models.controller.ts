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

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ModelsService } from './models.service';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { QueryModelsDto } from './dto/query-models.dto';
import { UploadedFiles } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Res } from '@nestjs/common';
import { StorageService } from '../../storage/storage.service';

@Controller('models')
export class ModelsController {
  constructor(
    private readonly modelsService: ModelsService,
    private readonly storageService: StorageService,
  ) {}

  // CREATE

@Post()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('designer')
@UseInterceptors(
  FileFieldsInterceptor([
    { name: 'file', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
)
async create(
  @UploadedFiles()
  files: {
    file?: Express.Multer.File[];
    images?: Express.Multer.File[];
  },
  @Body() dto: CreateModelDto,
  @Request() req: any,
) {
  const stlFile = files.file?.[0];

  if (!stlFile) {
    throw new Error('STL file is required');
  }

  const uploadResult = await this.storageService.uploadStl(stlFile);

  // 🔥 upload images
  const imageKeys: string[] = [];

  if (files.images && files.images.length > 0) {
    for (const image of files.images) {
      const key = await this.storageService.uploadFile(
        image,
        'models', // bucket
      );
      imageKeys.push(key);
    }
  }

  return this.modelsService.create(
    dto,
    req.user.userId,
    {
      stlKey: uploadResult.stlKey,
      width: uploadResult.width,
      height: uploadResult.height,
      depth: uploadResult.depth,
      volume: uploadResult.volume,
    },
    imageKeys, // 👈 НОВОЕ
  );
}

  // LIST (PUBLIC)
  @Get()
  findAll(@Query() query: QueryModelsDto) {
    return this.modelsService.findAll(query);
  }

  // 🔥 MY MODELS (ДОЛЖЕН БЫТЬ ВЫШЕ!)
  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  getMyModels(
    @Request() req: any,
    @Query() query: QueryModelsDto,
  ) {
    return this.modelsService.getMyModels(
      req.user.userId,
      query,
    );
  }

  // GET ONE (ВСЕГДА ПОСЛЕ custom routes)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modelsService.findOne(id);
  }

  // UPDATE
  @Post(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('designer')
  update(@Param('id') id: string, @Body() dto: UpdateModelDto) {
    return this.modelsService.update(id, dto);
  }

  // DELETE
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('designer', 'admin')
  delete(@Param('id') id: string) {
    return this.modelsService.delete(id);
  }

  // APPROVE
  @Post(':id/approve')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  approve(@Param('id') id: string, @Request() req: any) {
    return this.modelsService.approveModel(id, req.user.userId);
  }

  // REJECT
  @Post(':id/reject')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  reject(@Param('id') id: string, @Request() req: any) {
    return this.modelsService.rejectModel(id, req.user.userId);
  }

  // DOWNLOAD
  @Get(':id/download')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('executor')
download(@Param('id') id: string, @Request() req: any) {
  return this.modelsService.downloadModel(id, req.user.userId);
}

@Get('image/:key')
async getImage(@Param('key') key: string, @Res() res: any) {
  const stream = await this.storageService.getFileStream(key);

  stream.pipe(res);
}
  @Get('filters/options')
getFilterOptions() {
  return this.modelsService.getFilterOptions();
}
}