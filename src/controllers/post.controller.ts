/* eslint-disable no-unused-vars */
import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { PostRepository } from '../repository/post/post.repository.js';
import { CloudinaryService } from '../services/cloudinary.service.js';

const debug = createDebug('SN:Controller:postController');
export class postController {
  cloudinary: CloudinaryService;
  constructor(private repo: PostRepository) {
    this.cloudinary = new CloudinaryService();
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.file) {
        const path = req.file.destination + '/' + req.file.filename;
        const image = await this.cloudinary.uploadImage(path);
        req.body.image = image;
      }

      const data = await this.repo.create(req.body);

      res.status(201);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.repo.getAll();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.repo.update(req.body.validatedId, req.body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async addComment(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await this.repo.getById(req.body.validatedId);
      post.comments.push(req.body);
      const data = await this.repo.update(post.id, post);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}
