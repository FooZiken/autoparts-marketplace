import { Injectable } from '@nestjs/common';

@Injectable()
export class PricingService {

  calculatePrintPrice(volume: number, materialMultiplier: number): number {
    if (!volume) return 0;

    return volume * materialMultiplier;
  }

  calculatePlatformFee(total: number): number {
    const feePercent = 0.1; // 10%
    return total * feePercent;
  }

  calculateTotalPrice(params: {
    volume: number;
    materialMultiplier: number;
    designerPrice: number;
  }) {

    const printPrice = this.calculatePrintPrice(
      params.volume,
      params.materialMultiplier,
    );

    const subtotal = params.designerPrice + printPrice;

    const platformFee = this.calculatePlatformFee(subtotal);

    const total = subtotal + platformFee;

    return {
      designerPrice: params.designerPrice,
      printPrice,
      platformFee,
      total,
    };
  }
}