import { Comment } from './comment.entity.js';
import { User } from './user.entity.js';

export type Post = {
  id: string;
  title: string;
  description: string;
  author: User;
  likes: number;
  comments: Comment[];
};
