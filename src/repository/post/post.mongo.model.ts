import { Schema, model } from 'mongoose';
import { Post } from '../../entities/post.entity.js';

const PostSchema = new Schema<Post>({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  image: {
    type: {
      publicId: { type: String },
      width: { type: Number },
      height: { type: Number },
      format: { type: String },
      url: { type: String },
    },
    required: true,
  },
  date: { type: Date, default: Date.now },
});

PostSchema.set('toJSON', {
  transform(_document, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const PostModel = model('Post', PostSchema, 'posts');
