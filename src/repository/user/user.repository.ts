import createDebug from 'debug';

import { User } from '../../entities/user.entity.js';
import { Repository } from '../repository.interface.js';
import { UserModel } from './user.mongo.model.js';
const debug = createDebug('SN:Repo:UserRepo');

export class UserRepository implements Repository<User> {
  constructor() {
    debug('intantiate');
  }

  async getAll(): Promise<User[]> {
    const data = await UserModel.find().exec();
    return data;
  }

  async getById(id: string): Promise<User> {
    const data = await UserModel.findById(id)
      .populate('following')
      .populate('followers')
      .exec();

    if (!data) throw new Error('User not Found trying getById');
    return data;
  }

  async create(newItem: Omit<User, 'id'>): Promise<User> {
    const data = await UserModel.create(newItem);
    return data;
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: unknown;
  }): Promise<User[]> {
    const data = await UserModel.find({ [key]: value })
      .populate('following', {})
      .populate('followers', {})
      .exec();
    if (!data) throw new Error('User not found trying search');
    return data;
  }

  async update(id: string, newData: Partial<User>): Promise<User> {
    const data = await UserModel.findByIdAndUpdate(id, newData, {
      new: true,
    })
      .populate('following', {})
      .populate('followers', {})
      .exec();
    if (!data) throw new Error('User not found trying update');

    return data;
  }

  async delete(id: string): Promise<void> {
    const result = await UserModel.findByIdAndDelete(id);
    if (!result) throw new Error('User not found in file system trying delete');
  }
}
