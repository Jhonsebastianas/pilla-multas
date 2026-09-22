import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Permission } from './permission.document';

@Schema({ collection: 'roles', timestamps: true })
export class Role {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string; // Ej: Admin, Vendedor, Supervisor

  @Prop({ type: [{ type: Types.ObjectId, ref: Permission.name }] })
  permissions: Types.ObjectId[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
export type RoleDocument = Role & Document;
