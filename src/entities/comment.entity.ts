import { User } from './user.entity.js';

export type Comment = {
  id: string;
  content: string;
  author: User;
  likes: User[];
  nestedComments: Comment[];
  parentModel: string;
  parentId: string;
  date: Date;
};
