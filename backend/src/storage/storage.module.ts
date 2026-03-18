import { Module } from '@nestjs/common';

import { StorageService } from './storage.service';

import { StlAnalyzerModule } from '../services/stl-analyzer.module';

@Module({
  imports: [
    StlAnalyzerModule, // 🔥 ВАЖНО
  ],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}