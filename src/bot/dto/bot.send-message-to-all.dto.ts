import { IsString } from 'class-validator';

export class BotSendMessageToAllDto {
  @IsString()
  message: string;
}
