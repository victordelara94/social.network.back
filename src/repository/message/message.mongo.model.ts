import { Schema, model } from 'mongoose';
import { Message } from '../../entities/message.entity';

const MessageSchema = new Schema<Message>({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  to: { type: Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

MessageSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const MessageModel = model('Message', MessageSchema, 'messages');
