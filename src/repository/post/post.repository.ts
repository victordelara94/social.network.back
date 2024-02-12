import createDebug from 'debug';
import { Post } from '../../entities/post.entity.js';
import { Repository } from '../repository.interface.js';
import { PostModel } from './post.mongo.model.js';
const debug = createDebug('SN:Repo:PostRepo');

export class PostRepository implements Repository<Post> {
  constructor() {
    debug('instantiated');
  }

  async create(newItem: Omit<Post, 'id'>): Promise<Post> {
    const data = await PostModel.create(newItem);
    return data;
  }

  async search({
    key,
    value,
  }: {
    key: string;
    value: unknown;
  }): Promise<Post[]> {
    const data = await PostModel.find({ [key]: value })
      .populate('author', {})
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'userName' },
      })
      .exec();

    if (!data) throw new Error('Post not found trying search');
    return data;
  }

  async getById(id: string): Promise<Post> {
    const data = await PostModel.findById(id).populate('author').exec();

    if (!data) throw new Error('Post not Found trying getById');

    return data;
  }

  async update(id: string, updatedItem: Partial<Post>): Promise<Post> {
    const data = await PostModel.findByIdAndUpdate(id, updatedItem, {
      new: true,
    }).exec();
    if (!data) throw new Error('Post not found trying update');

    return data;
  }

  async delete(id: string): Promise<void> {
    const result = await PostModel.findByIdAndDelete(id);
    if (!result) throw new Error('Post not found in file system trying delete');
  }
}
