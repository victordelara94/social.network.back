/* eslint-disable no-useless-constructor */
/* eslint-disable no-unused-vars */
import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { Comment } from '../entities/comment.entity.js';
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
      if (!author) {
        throw new Error('User not found');
      }

      req.body.author = author;
    } catch (error) {
      next(error);
    }
  }

  async createIntoComment(req: Request, res: Response, next: NextFunction) {
    try {
      this.create(req, res, next);
      const parent = await this.commentRepo.getById(req.body.parentId);
      if (!parent) {
        throw new Error('Comment parent not found');
      }

      req.body.parentId = parent.id;
      req.body.parentModel = 'Comment';
      const comment = await this.commentRepo.create(req.body);
      parent.nestedComments.push(comment);
      await this.commentRepo.update(parent.id, parent);

      res.status(201);
      res.json(comment);
    } catch (error) {
      next(error);
    }
  }

  async createIntoPost(req: Request, res: Response, next: NextFunction) {
    try {
      this.create(req, res, next);
      const parent = await this.postRepo.getById(req.body.parentId);
      if (!parent) {
        throw new Error('Post parent not found');
      }

      req.body.parentId = parent.id;

      req.body.parentModel = 'Post';
      const comment = await this.commentRepo.create(req.body);

      parent.nestedComments.push(comment);
      const newParentData = await this.postRepo.update(parent.id, parent);
      debug(newParentData);
      res.status(201);
      res.json(comment);
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
      const data = await this.commentRepo.update(comment.id, comment);
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

  async editComment(req: Request, res: Response, next: NextFunction) {
    try {
      const newComment = await this.commentRepo.update(req.body.id, req.body);
      debug(newComment, 'Comment');
      res.json(newComment);
    } catch (error) {
      next(error);
    }
  }

  // Async deleteComment(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const comment = await this.commentRepo.getById(req.params.id);
  //     if (!comment) {
  //       throw new Error('Comment not found');
  //     }

  //     if (comment.parentModel === 'Comment') {
  //       const parent = await this.commentRepo.getById(comment.parentId);
  //       if (!parent) {
  //         throw new Error('Comment parent not found');
  //       }

  //       const newCommentComments = parent.nestedComments.filter(
  //         (item) => item.id !== comment.id
  //       );
  //       await this.commentRepo.update(parent.id, {
  //         nestedComments: newCommentComments,
  //       });
  //     } else {
  //       const parent = await this.postRepo.getById(comment.parentId);
  //       if (!parent) {
  //         throw new Error('Post parent not found');
  //       }

  //       const newPostComments = parent.nestedComments.filter(
  //         (item) => item.toString() !== comment.id
  //       );
  //       debug(newPostComments);
  //       await this.postRepo.update(parent.id, {
  //         nestedComments: newPostComments,
  //       });
  //     }

  //     await this.commentRepo.delete(comment.id);
  //     res.json({});
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  async deleteComment(req: Request, res: Response, next: NextFunction) {
    try {
      const comment = await this.commentRepo.getById(req.params.id);
      if (!comment) {
        throw new Error('Comment not found');
      }

      if (comment.parentModel === 'Comment') {
        await this.deleteCommentInParentComment(comment);
      } else {
        await this.deleteCommentInParentPost(comment);
      }

      await this.commentRepo.delete(comment.id);
      res.json({});
    } catch (error) {
      next(error);
    }
  }

  private async deleteCommentInParentComment(comment: Comment) {
    const parent = await this.commentRepo.getById(comment.parentId);
    if (!parent) {
      throw new Error('Comment parent not found');
    }

    const newCommentComments = parent.nestedComments.filter(
      (item) => item.id !== comment.id
    );
    await this.commentRepo.update(parent.id, {
      nestedComments: newCommentComments,
    });
  }

  private async deleteCommentInParentPost(comment: Comment) {
    const parent = await this.postRepo.getById(comment.parentId);
    if (!parent) {
      throw new Error('Post parent not found');
    }

    const newPostComments = parent.nestedComments.filter(
      (item) => item.toString() !== comment.id
    );

    await this.postRepo.update(parent.id, {
      nestedComments: newPostComments,
    });
  }
}
