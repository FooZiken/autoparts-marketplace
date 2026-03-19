import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SlicingProcessor } from './slicing.processor';
import { PrintJobsModule } from '../print-jobs/print-jobs.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'slicing',
    }),
    PrintJobsModule, // 👈 ВАЖНО
  ],
  providers: [SlicingProcessor],
})
export class SlicingModule {}