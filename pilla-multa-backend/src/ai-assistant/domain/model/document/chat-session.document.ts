import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'ai_chat_sessions', timestamps: true })
export class ChatSession {
  _id: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
    name: 'id_user',
  })
  idUser: Types.ObjectId;

  @Prop({ type: String, required: false })
  title: string;

  @Prop({ type: Object, required: false, name: 'context_info' })
  contextInfo: Record<string, any>;

  @Prop({
    type: [{ role: String, content: String, timestamp: Date }],
    required: true,
  })
  messages: {
    role: 'system' | 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }[];
}

export const ChatSessionSchema = SchemaFactory.createForClass(ChatSession);
export type ChatSessionDocument = ChatSession & Document;
