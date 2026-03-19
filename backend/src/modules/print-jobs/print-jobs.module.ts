import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrintJob } from './entities/print-job.entity';
import { PrintJobsService } from './print-jobs.service';

@Module({
  imports: [TypeOrmModule.forFeature([PrintJob])],
  providers: [PrintJobsService],
  exports: [PrintJobsService],
})
export class PrintJobsModule {}