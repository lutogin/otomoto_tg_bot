import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateSearchRequestDto } from './create-search-request.dto';

export class UpdateSearchRequestDto extends PartialType(
  PickType(CreateSearchRequestDto, ['url', 'lastSeenArticleIds']),
) {}
