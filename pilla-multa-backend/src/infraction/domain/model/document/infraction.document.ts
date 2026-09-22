import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum InfractionStatus {
  PENDING_VALIDATION = 'PENDING_VALIDATION',
  VALIDATED = 'VALIDATED',
  REJECTED = 'REJECTED',
  PROCESSED = 'PROCESSED',
}

@Schema({ collection: 'infractions', timestamps: true })
export class Infraction {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, name: 'id_user' })
  idUser: Types.ObjectId;

  @Prop({ type: String, required: true })
  imageUrl: string; // The URL to the storage block (e.g. S3 or local storage)

  @Prop({ type: String, required: false })
  plate: string; // The detected license plate

  @Prop({ type: Number, required: true })
  latitude: number;

  @Prop({ type: Number, required: true })
  longitude: number;

  @Prop({ type: String, required: false })
  description: string;

  @Prop({ type: String, enum: InfractionStatus, default: InfractionStatus.PENDING_VALIDATION })
  status: InfractionStatus;

  @Prop({ type: Object, required: false, name: 'ai_validation_data' })
  aiValidationData: Record<string, any>; // Confidence score, detected elements, etc.
}

export const InfractionSchema = SchemaFactory.createForClass(Infraction);
export type InfractionDocument = Infraction & Document;
