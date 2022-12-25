import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class BotSendMessageDirectrlyDto {
  @IsNumber()
  @Type(() => Number)
  chatId: number;

  @IsString()
  message: string;
}
