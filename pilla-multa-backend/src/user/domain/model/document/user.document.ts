import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ContactDTO } from '../dto/contact.dto';

@Schema({ collection: 'users', timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true })
  names: string;

  @Prop({ required: false })
  lastnames: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  contact: ContactDTO;

  @Prop({ required: true, default: false })
  active: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
