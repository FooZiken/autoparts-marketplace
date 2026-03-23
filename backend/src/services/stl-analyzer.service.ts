import { Injectable, BadRequestException } from '@nestjs/common';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import * as THREE from 'three';

@Injectable()
export class StlAnalyzerService {

  analyze(buffer: Buffer) {
    try {
      const loader = new STLLoader();

      // 🔥 поддерживает binary + ASCII
      const arrayBuffer = buffer.buffer.slice(
  buffer.byteOffset,
  buffer.byteOffset + buffer.byteLength
);

const geometry = loader.parse(arrayBuffer);

      if (!geometry || !geometry.attributes?.position) {
        throw new Error();
      }

      const positionsArray = geometry.attributes.position.array as ArrayLike<number>;

      const positions: number[] = Array.from(positionsArray);

      let minX = Infinity, minY = Infinity, minZ = Infinity;
      let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        const z = positions[i + 2];

        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (z < minZ) minZ = z;

        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
        if (z > maxZ) maxZ = z;
      }

      const width = maxX - minX;
      const height = maxY - minY;
      const depth = maxZ - minZ;

      const volume = this.computeVolume(positions);

      return {
        width,
        height,
        depth,
        volume,
        triangleCount: positions.length / 9,
      };

    } catch (e) {
      console.error('STL parse error:', e.message);
      throw new BadRequestException('Invalid STL file');
    }
  }

  private computeVolume(positions: number[]): number {
    let volume = 0;

    for (let i = 0; i < positions.length; i += 9) {
      const ax = positions[i];
      const ay = positions[i + 1];
      const az = positions[i + 2];

      const bx = positions[i + 3];
      const by = positions[i + 4];
      const bz = positions[i + 5];

      const cx = positions[i + 6];
      const cy = positions[i + 7];
      const cz = positions[i + 8];

      volume += (
        ax * by * cz +
        ay * bz * cx +
        az * bx * cy -
        az * by * cx -
        ay * bx * cz -
        ax * bz * cy
      ) / 6;
    }

    return Math.abs(volume);
  }
}