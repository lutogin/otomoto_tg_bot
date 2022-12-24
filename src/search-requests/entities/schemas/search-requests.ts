import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'search-requests', timestamps: true, _id: false })
export class SearchRequests {
  @Prop({ type: Number, required: true, unique: true })
  chatId: string;

  @Prop({ type: Number, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  languageCode: string;

  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: String, required: true })
  lastSeenArticleId: number;
}

export type SearchRequestsDocument = HydratedDocument<SearchRequests>;

export const SearchRequestsSchema =
  SchemaFactory.createForClass(SearchRequests);
