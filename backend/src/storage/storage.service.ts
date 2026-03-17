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

    // ❗ 1. проверка наличия файла
    if (!file || !file.buffer) {
      throw new BadRequestException('File is required');
    }

    // ❗ 2. ограничение размера (100MB)
    const MAX_SIZE = 100 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new BadRequestException('File too large (max 100MB)');
    }

    // ❗ 3. базовая проверка STL
    if (!this.isValidStl(file.buffer)) {
      throw new BadRequestException('Invalid STL file');
    }

    // 🔥 4. анализ STL (ОБЯЗАТЕЛЬНО)
    const analysis = this.stlAnalyzer.analyze(file.buffer);

    // ❗ защита от пустых/битых моделей
    if (!analysis.triangleCount || analysis.triangleCount <= 0) {
      throw new BadRequestException('Invalid STL geometry');
    }

    const key = `${randomUUID()}.stl`;

    await MinioClient.putObject(
      this.bucket,
      key,
      file.buffer,
      file.size,
      {
        'Content-Type': file.mimetype || 'application/sla',
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

    const expiry = 60 * 5;

    return MinioClient.presignedGetObject(
      this.bucket,
      stlKey,
      expiry,
    );
  }

  private isValidStl(buffer: Buffer): boolean {

    // ASCII STL
    const header = buffer.toString('utf8', 0, 5).toLowerCase();
    if (header === 'solid') {
      return true;
    }

    // Binary STL (минимальный размер)
    if (buffer.length > 84) {
      return true;
    }

    return false;
  }
}