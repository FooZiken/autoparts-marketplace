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