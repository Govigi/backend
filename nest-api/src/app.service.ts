import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  getHello(): string | number {
    console.log('running at', this.configService.get('PORT'));
    return this.configService.get<number>('PORT') || 'hello';
  }
}
