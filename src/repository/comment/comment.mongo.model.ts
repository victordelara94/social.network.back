import { Schema, model } from 'mongoose';
import { Comment } from '../../entities/comment.entity';
const CommentSchema = new Schema<Comment>({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  postTarget: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  likes: { type: Number, default: 0 },
});

CommentSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const commentModel = model('Comment', CommentSchema, 'comments');
