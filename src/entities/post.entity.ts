import { ImgData } from '../types/types.js';
import { Comment } from './comment.entity.js';
import { User } from './user.entity.js';

export type Post = {
  id: string;
  content: string;
  author: User;
  likes: User[];
  image: ImgData;
  nestedComments: Comment[];
  date: Date;
};
