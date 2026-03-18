import { Module } from '@nestjs/common';
import { StlAnalyzerService } from './stl-analyzer.service';

@Module({
  providers: [StlAnalyzerService],
  exports: [StlAnalyzerService],
})
export class StlAnalyzerModule {}