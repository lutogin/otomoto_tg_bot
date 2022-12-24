import { IsArray, IsNumber, IsString } from 'class-validator';

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

  @IsArray()
  @IsString({ each: true })
  lastSeenArticleIds: string[];
}
