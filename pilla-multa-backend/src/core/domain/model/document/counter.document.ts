import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'counters', timestamps: true })
export class Counter {
  _id: Types.ObjectId;

  @Prop({ required: false, type: Types.ObjectId, ref: 'business' })
  businessId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, default: 0 })
  sequenceValue: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);

// Índice compuesto único: un contador por nombre POR negocio
CounterSchema.index({ name: 1, businessId: 1 }, { unique: true });

export type CounterDocument = Counter & Document;
