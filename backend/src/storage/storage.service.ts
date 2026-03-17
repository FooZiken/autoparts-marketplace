import { Injectable, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MinioClient } from './minio.client';
import { StlAnalyzerService } from '../services/stl-analyzer.service';

@Injectable()
export class StorageService {

  private bucket = 'models';

  constructor(
    private stlAnalyzer: StlAnalyzerService,
  ) {}

  async uploadStl(file: Express.Multer.File) {

    if (!this.isValidStl(file.buffer)) {
      throw new BadRequestException('Invalid STL file');
    }

    // 🔥 анализ STL
    const analysis = this.stlAnalyzer.analyze(file.buffer);

    const key = `${randomUUID()}.stl`;

    await MinioClient.putObject(
      this.bucket,
      key,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype,
      },
    );

    return {
      stlKey: key,
      width: analysis.width,
      height: analysis.height,
      depth: analysis.depth,
      volume: analysis.volume,
      triangleCount: analysis.triangleCount,
    };
  }

  async generateDownloadUrl(stlKey: string) {

    const expiry = 60 * 5; // 5 minutes

    const url = await MinioClient.presignedGetObject(
      this.bucket,
      stlKey,
      expiry,
    );

    return url;
  }

  private isValidStl(buffer: Buffer): boolean {

    const header = buffer.toString('utf8', 0, 5);

    if (header === 'solid') {
      return true;
    }

    if (buffer.length > 84) {
      return true;
    }

    return false;
  }

}