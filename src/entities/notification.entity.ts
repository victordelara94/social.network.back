import { User } from './user.entity.js';

export type Notification = {
  id: string;
  type: string;
  to: User;
  from: User;
  hasBeenRead: boolean;
  date: Date;
};
