import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrintJobsService } from '../print-jobs/print-jobs.service';

@Processor('slicing')
export class SlicingProcessor extends WorkerHost {

  constructor(
    private readonly printJobsService: PrintJobsService,
  ) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    const { printJobId } = job.data;

    console.log('SLICING START', printJobId);

    await this.printJobsService.setSlicing(printJobId);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const fakeGcodePath = `gcode/job-${printJobId}.gcode`;

    await this.printJobsService.setReady(printJobId, fakeGcodePath);

    console.log('SLICING DONE', printJobId);

    return true;
  }
}