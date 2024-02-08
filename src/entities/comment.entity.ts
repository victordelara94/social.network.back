import { Post } from './post.entity.js';
import { User } from './user.entity.js';

export type Comment = {
  id: string;
  content: string;
  user: User;
  post: Post;
  isPrivate: boolean;
  likes: number;
};
