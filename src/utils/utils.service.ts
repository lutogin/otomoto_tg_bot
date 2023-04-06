import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UtilsService {
  constructor(private readonly httpService: HttpService) {}

  async getImageBuffer(url): Promise<Buffer> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(url, {
          responseType: 'arraybuffer',
        }),
      );

      return Buffer.from(data);
    } catch (e) {
      console.error(`Url: ${url}`);
      throw e;
    }
  }
}
