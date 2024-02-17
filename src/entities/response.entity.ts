import { Comment } from './comment.entity.js';
import { User } from './user.entity.js';

export type Response = {
  id: string;
  content: string;
  author: User;
  likes: number;
  comment: Comment;
};
