import { Schema, model } from 'mongoose';
import { Response } from '../../entities/response.entity';
const ResponseSchema = new Schema<Response>({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: Schema.Types.ObjectId, ref: 'Comment', required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  date: { type: Date, default: Date.now },
});

ResponseSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const ResponseModel = model('Response', ResponseSchema, 'responses');
