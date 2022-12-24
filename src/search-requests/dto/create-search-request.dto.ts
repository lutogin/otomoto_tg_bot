import { IsNumber, IsString } from 'class-validator';

export class CreateSearchRequestDto {
  @IsNumber()
  chatId: number;

  @IsString()
  userId: number;

  @IsString()
  firstName: string;

  @IsString()
  userName: string;

  @IsString()
  languageCode: string;

  @IsString()
  url: string;

  @IsString()
  lastSeenArticleId: string;
}
