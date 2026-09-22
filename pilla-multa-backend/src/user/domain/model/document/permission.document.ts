import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'permissions', timestamps: true })
export class Permission {
  _id: Types.ObjectId;

  @Prop({ required: true })
  action: string; // Ej: 'READ_SALES', 'EDIT_PRODUCTS'

  @Prop({ required: true })
  description: string; // Ej: 'READ_SALES', 'EDIT_PRODUCTS'

  @Prop({ required: true })
  module: string; // Ej: 'Ventas', 'Productos'
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
export type PermissionDocument = Permission & Document;
