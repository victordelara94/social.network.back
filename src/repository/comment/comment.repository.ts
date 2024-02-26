import createDebug from 'debug';
import { Comment } from '../../entities/comment.entity.js';
import { Repository } from '../repository.interface.js';
import { CommentModel } from './comment.mongo.model.js';
const debug = createDebug('SN:Repo:CommentRepo');

export class CommentRepository implements Repository<Comment> {
  constructor() {
    debug('instantiated');
  }

  async create(newItem: Omit<Comment, 'id'>): Promise<Comment> {
    debug(newItem);
    const data = await CommentModel.create(newItem);
    return data;
  }

  async update(id: string, updatedItem: Partial<Comment>): Promise<Comment> {
    const data = await CommentModel.findByIdAndUpdate(id, updatedItem, {
      new: true,
    }).exec();
    if (!data) throw new Error('Comment not found trying update');

    return data;
  }

  async delete(id: string): Promise<void> {
    const result = await CommentModel.findByIdAndDelete(id);
    if (!result)
      throw new Error('Comment not found in file system trying delete');
  }

  async getById(id: string): Promise<Comment> {
    const data = await CommentModel.findById(id)
      .populate('author')
      .populate('likes', 'userName _id')
      .exec();

    if (!data) throw new Error('Comment not Found trying getById');

    return data;
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: unknown;
  }): Promise<Comment[]> {
    const data = await CommentModel.find({ [key]: value })
      .populate('author', {})
      .exec();

    if (!data) throw new Error('Comment not found trying search');
    return data;
  }
}
