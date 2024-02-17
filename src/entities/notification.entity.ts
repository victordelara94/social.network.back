import { Comment } from './comment.entity.js';
import { Message } from './message.entity.js';
import { User } from './user.entity.js';

export type Notification = {
  id: string;
  type: string;
  to: User;
  relationType: User | Comment | Response | Message;
  hasBeenRead: boolean;
  date: Date;
};
