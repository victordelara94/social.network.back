import createDebug from 'debug';
import { Post } from '../../entities/post.entity';
import { Repository } from '../repository.interface';
import { PostModel } from './post.mongo.model';
const debug = createDebug('SN:Repo:PostRepo');

export class PostRepository implements Repository<Post> {
  urlBase: string;
  constructor(urlBase: string) {
    this.urlBase = urlBase;
    debug('instantiated');
  }

  async create(newItem: Omit<Post, 'id'>): Promise<Post> {
    const data = await PostModel.create(newItem);
    return data;
  }

  async getAll(): Promise<Post[]> {
    const data = await PostModel.find().exec();
    return data;
  }

  async update(id: string, updatedItem: Partial<Post>): Promise<Post> {
    const data = await PostModel.findByIdAndUpdate(id, updatedItem, {
      new: true,
    }).exec();
    if (!data) throw new Error('User not found trying update');

    return data;
  }

  async delete(id: string): Promise<void> {
    const result = await PostModel.findByIdAndDelete(id);
    if (!result) throw new Error('User not found in file system trying delete');
  }
}
