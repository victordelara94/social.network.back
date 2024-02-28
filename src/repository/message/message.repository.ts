import createDebug from 'debug';
import { Message } from '../../entities/message.entity.js';
import { User } from '../../entities/user.entity.js';
import { Repository } from '../repository.interface.js';
import { MessageModel } from './message.mongo.model.js';
const debug = createDebug('SN:Repo:MessageRepo');
export class MessageRepository implements Repository<Message> {
  constructor() {
    debug('intantiated');
  }

  async create(newItem: Partial<Message>): Promise<Message> {
    const data = await MessageModel.create(newItem);
    return data;
  }

  async searchConversationMessages(criteria: {
    author: User;
    receiver: User;
  }): Promise<Message[]> {
    const { author, receiver } = criteria;

    const conversationMessages = await MessageModel.find({
      $or: [
        { author, to: receiver },
        { author: receiver, to: author },
      ],
    });
    if (conversationMessages.length === 0)
      throw new Error(
        'Messags not found in file system trying search conversation messages'
      );
    return conversationMessages;
  }

  async getById(id: string): Promise<Message> {
    const data = await MessageModel.findById(id).exec();

    if (!data) throw new Error('Message not Found trying getById');
    return data;
  }

  async delete(id: string): Promise<void> {
    const result = await MessageModel.findByIdAndDelete(id);
    if (!result)
      throw new Error('Message not found in file system trying delete');
  }
}
