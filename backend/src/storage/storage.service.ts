import { Injectable, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MinioClient } from './minio.client';

@Injectable()
export class StorageService {

  private bucket = 'models';

  async uploadStl(file: Express.Multer.File): Promise<string> {

    if (!this.isValidStl(file.buffer)) {
      throw new BadRequestException('Invalid STL file');
    }

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

    return key;
  }

  private isValidStl(buffer: Buffer): boolean {

    // ASCII STL обычно начинается с "solid"
    const header = buffer.toString('utf8', 0, 5);

    if (header === 'solid') {
      return true;
    }

    // Binary STL минимум 84 байта
    if (buffer.length > 84) {
      return true;
    }

    return false;
  }

}