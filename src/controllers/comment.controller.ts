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
    private commentRepo: CommentRepository,
    private userRepo: UserRepository,
    private postRepo: PostRepository
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const author = await this.userRepo.getById(req.body.validatedId);
      const post = await this.postRepo.getById(req.params.id);
      req.body.author = author;
      const comment = await this.commentRepo.create(req.body);
      post.comments.push(comment);
      const postWithComments = await this.postRepo.update(post.id, post);
      res.status(201);
      res.json(postWithComments);
    } catch (error) {
      next(error);
    }
  }

  async addLike(req: Request, res: Response, next: NextFunction) {
    try {
      const comment = await this.commentRepo.getById(req.params.id);
      const userAlreadyLiked = comment.likes.find(
        (user) => user.id.toString() === req.body.validatedId
      );
      if (userAlreadyLiked) {
        throw Error(`The user has already liked to this post`);
      }

      const user = await this.userRepo.getById(req.body.validatedId);

      comment.likes.push(user);
      const data = await this.postRepo.update(comment.id, comment);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async dislike(req: Request, res: Response, next: NextFunction) {
    try {
      const comment = await this.commentRepo.getById(req.params.id);
      const userAlreadyLiked = comment.likes.find(
        (user) => user.id.toString() === req.body.validatedId
      );
      if (!userAlreadyLiked) {
        throw Error(`The user hasn´t already liked to this comment`);
      }

      const newLikesData = comment.likes.filter(
        (item) => item.id !== req.body.validatedId
      );
      const data = await this.commentRepo.update(comment.id, {
        likes: newLikesData,
      });
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}
