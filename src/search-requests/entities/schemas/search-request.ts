import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'search-requests', timestamps: true, _id: false })
export class SearchRequest {
  @Prop({ type: Number, required: true, unique: true })
  chatId: number;

  @Prop({ type: Number, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: false, default: null })
  userName: string;

  @Prop({ type: String, required: true })
  languageCode: string;

  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: String, required: false })
  lastSeenArticleId: string;
}

export type SearchRequestsDocument = HydratedDocument<SearchRequest>;

export const SearchRequestsSchema = SchemaFactory.createForClass(SearchRequest);
