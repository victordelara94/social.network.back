import { Schema, model } from 'mongoose';
import { Comment } from '../../entities/comment.entity';
const CommentSchema = new Schema<Comment>({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  parentModel: { type: String, enum: ['Comment', 'Post'] },
  parentId: { type: String, required: true },
  nestedComments: [{ type: String, ref: 'Comment' }],
  date: { type: Date, default: Date.now },
});

CommentSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const CommentModel = model('Comment', CommentSchema, 'comments');
