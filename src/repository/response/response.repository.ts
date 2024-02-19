import createDebug from 'debug';
import { Response } from '../../entities/response.entity.js';
import { Repository } from '../repository.interface.js';
import { ResponseModel } from './response.mongo.model.js';
const debug = createDebug('SN:Repo:ResponseRepo');

export class ResponseRepository implements Repository<Response> {
  constructor() {
    debug('instantiated');
  }

  async create(newItem: Omit<Response, 'id'>): Promise<Response> {
    const data = await ResponseModel.create(newItem);
    return data;
  }

  async update(id: string, updatedItem: Partial<Response>): Promise<Response> {
    const data = await ResponseModel.findByIdAndUpdate(id, updatedItem, {
      new: true,
    }).exec();
    if (!data) throw new Error('Response not found trying update');

    return data;
  }

  async delete(id: string): Promise<void> {
    const result = await ResponseModel.findByIdAndDelete(id);
    if (!result)
      throw new Error('Response not found in file system trying delete');
  }

  async getById(id: string): Promise<Response> {
    const data = await ResponseModel.findById(id)
      .populate('author')
      .populate('likes', 'userName _id')
      .exec();

    if (!data) throw new Error('Response not Found trying getById');

    return data;
  }
}
