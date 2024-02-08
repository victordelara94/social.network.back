/* eslint-disable no-unused-vars */
import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { PostRepository } from '../repository/post/post.repository.js';
import { UserRepository } from '../repository/user/user.repository.js';
import { CloudinaryService } from '../services/cloudinary.service.js';

const debug = createDebug('SN:Controller:postController');
export class PostController {
  cloudinary: CloudinaryService;
  constructor(
    private postRepo: PostRepository,
    private userRepo: UserRepository
  ) {
    this.cloudinary = new CloudinaryService();
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.file) {
        const path = req.file.destination + '/' + req.file.filename;
        const image = await this.cloudinary.uploadImage(path);
        req.body.image = image;
      }

      debug(req.body.validatedId, 'validated id');
      const author = await this.userRepo.getById(req.body.validatedId);
      req.body.author = author;
      debug(req.body, 'POST EN CREATE');
      const data = await this.postRepo.create(req.body);

      res.status(201);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.postRepo.getAll();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.postRepo.update(req.params.id, req.body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await this.postRepo.getById(req.body.validatedId);
      post.comments.push(req.body);
      const data = await this.postRepo.update(post.id, post);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}
