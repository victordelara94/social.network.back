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

      const author = await this.userRepo.getById(req.body.validatedId);
      req.body.author = author;

      const data = await this.postRepo.create(req.body);

      res.status(201);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getUserPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const userPosts = await this.postRepo.search({
        key: 'author',
        value: req.params.id,
      });
      res.json(userPosts);
    } catch (error) {
      next(error);
    }
  }

  async getFriendsPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const currentUser = await this.userRepo.getById(req.body.validatedId);

      const friends = await Promise.all(
        currentUser.following
          .map((user) => this.userRepo.getById(user.id))
          .flat()
      );
      const mutualFriends = friends.filter((friend) =>
        friend.following.some((follow) => follow.id === currentUser.id)
      );

      const notPrivateFriends = friends.filter((friend) => !friend.isPrivate);
      const validFriendSet = new Set([...mutualFriends, ...notPrivateFriends]);
      const validFriends = Array.from(validFriendSet);

      const data = await Promise.all(
        validFriends.map((friend) =>
          this.postRepo.search({ key: 'author', value: friend.id })
        )
      );
      debug(data.flat());
      res.json(data.flat());
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
      const post = await this.postRepo.getById(req.params.id);
      post.comments.push(req.body);
      const data = await this.postRepo.update(post.id, post);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}
