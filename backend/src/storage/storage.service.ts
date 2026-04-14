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

    // ❗ 1. файл обязателен
    if (!file || !file.buffer) {
      throw new BadRequestException('File is required');
    }

    // ❗ 2. лимит 100MB
    const MAX_SIZE = 100 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new BadRequestException('File too large (max 100MB)');
    }

    // ❗ 3. проверка расширения (вместо кривого buffer-чека)
    if (!this.isValidStl(file)) {
      throw new BadRequestException('Invalid STL file');
    }

    // 🔥 4. анализ STL
    const analysis = this.stlAnalyzer.analyze(file.buffer);

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

  async uploadFile(
  file: Express.Multer.File,
  bucket: string = this.bucket,
) {
  if (!file || !file.buffer) {
    throw new BadRequestException('File is required');
  }

  // 🔒 ограничим размер (10MB для картинок)
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new BadRequestException('Image too large (max 10MB)');
  }

  // 🔒 базовая проверка типа
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new BadRequestException('Invalid image type');
  }

  const ext = file.originalname.split('.').pop();
  const key = `${randomUUID()}.${ext}`;

  await MinioClient.putObject(
    bucket,
    key,
    file.buffer,
    file.size,
    {
      'Content-Type': file.mimetype,
    },
  );

  return key;
}

  async generateDownloadUrl(stlKey: string) {
    const expiry = 60 * 5;

    return MinioClient.presignedGetObject(
      this.bucket,
      stlKey,
      expiry,
    );
  }

  async getFileStream(key: string) {
  return MinioClient.getObject(this.bucket, key);
}

  // 🔥 НОВАЯ ПРОВЕРКА (простая и надёжная)
  private isValidStl(file: Express.Multer.File): boolean {

    const isStlName = file.originalname
      ?.toLowerCase()
      .endsWith('.stl');

    const allowedMimeTypes = [
      'model/stl',
      'application/sla',
      'application/octet-stream',
    ];

    const isValidMime = allowedMimeTypes.includes(file.mimetype);

    return isStlName || isValidMime;
  }
}