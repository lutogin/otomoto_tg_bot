import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class OtomotoClientService {
  constructor(private readonly client: HttpService) {}

  makeRequest(url: string): Promise<any> {
    return firstValueFrom(
      this.client
        .get(url, {
          headers: {
            'User-Agent': 'Chrome/108.0.0.0',
            Host: 'www.otomoto.pl',
            'Cache-Control': 'no-cache',
          },
        })
        .pipe(map((resp) => resp.data)),
    );
  }
}
