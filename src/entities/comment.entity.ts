import { Post } from './post.entity.js';
import { User } from './user.entity.js';

export type Comment = {
  id: string;
  content: string;
  author: User;
  postTarget: Post;
  likes: number;
};
