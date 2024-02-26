import createDebug from 'debug';
import { Message } from '../../entities/message.entity';
import { Repository } from '../repository.interface';
import { MessageModel } from './message.mongo.model';
const debug = createDebug('SN:Repo:MessageRepo');
export class MessageRepository implements Repository<Message> {
  constructor() {
    debug('intantiated');
  }

  async create(newItem: Omit<Message, 'id'>): Promise<Message> {
    const data = await MessageModel.create(newItem);
    return data;
  }

  async search({
    key,
    value,
  }: {
    key: keyof Message;
    value: unknown;
  }): Promise<Message[]> {
    const messages = await MessageModel.find({ [key]: value });
    if (!messages)
      throw new Error(`Messages not found in file system trying search`);
    return messages;
  }

  async delete(id: string): Promise<void> {
    const result = await MessageModel.findByIdAndDelete(id);
    if (!result)
      throw new Error('Message not found in file system trying delete');
  }
}
