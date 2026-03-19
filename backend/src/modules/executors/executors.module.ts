import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Executor } from './entities/executor.entity';
import { ExecutorsService } from './executors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Executor])],
  providers: [ExecutorsService],
  exports: [ExecutorsService],
})
export class ExecutorsModule {}