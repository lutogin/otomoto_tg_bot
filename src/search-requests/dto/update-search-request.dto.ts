import { PickType } from '@nestjs/mapped-types';
import { CreateSearchRequestDto } from './create-search-request.dto';

export class UpdateSearchRequestDto extends PickType(CreateSearchRequestDto, [
  'url',
]) {}
