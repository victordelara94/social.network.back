import { User } from './user.entity.js';
export type Message = {
  id: string;
  content: string;
  author: User;
  to: User;
  date: Date;
};
