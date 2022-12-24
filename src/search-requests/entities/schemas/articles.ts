import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'articles', timestamps: true, _id: false })
export class Articles {
  @Prop({ type: String, required: true, unique: true })
  id: string;

  @Prop({ type: String, required: true, unique: true })
  link: string;

  @Prop({ type: String })
  title?: string;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String })
  year: string;

  @Prop({ type: String })
  mileage: string;

  @Prop({ type: String })
  engine: string;

  @Prop({ type: String })
  fuelType: string;

  @Prop({ type: String })
  location: string;

  @Prop({ type: String })
  date: string;

  @Prop({ type: String })
  img: string;

  @Prop({ type: String })
  price: string;
}

export type ArticlesDocument = HydratedDocument<Articles>;

export const ArticlesSchema = SchemaFactory.createForClass(Articles);
