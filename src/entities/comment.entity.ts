import { User } from './user.entity.js';

export type Comment = {
  id: string;
  content: string;
  author: User;
  likes: User[];
  date: Date;
};
