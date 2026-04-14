import { Controller, Get, Query } from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get('brands')
  getBrands() {
    return this.carsService.findBrands();
  }

  @Get('models')
  getModels(@Query('brandId') brandId?: string) {
    return this.carsService.findModels(brandId);
  }

  @Get('bodies')
  getBodies(@Query('modelId') modelId?: string) {
    return this.carsService.findBodies(modelId);
  }
}