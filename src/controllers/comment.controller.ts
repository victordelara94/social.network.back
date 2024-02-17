/* eslint-disable no-useless-constructor */
/* eslint-disable no-unused-vars */
import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { CommentRepository } from '../repository/comment/comment.repository.js';
import { PostRepository } from '../repository/post/post.repository.js';
import { UserRepository } from '../repository/user/user.repository.js';

const debug = createDebug('SN:Controller:CommentController');
export class CommentController {
  constructor(
    private CommentRepo: CommentRepository,
    private userRepo: UserRepository,
    private postRepo: PostRepository
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const author = await this.userRepo.getById(req.body.validatedId);
      const post = await this.postRepo.getById(req.params.id);
      req.body.author = author;
      const comment = await this.CommentRepo.create(req.body);
      post.comments.push(comment);
      const postWithComments = await this.postRepo.update(post.id, post);
      res.status(201);
      res.json(postWithComments);
    } catch (error) {
      next(error);
    }
  }
}
