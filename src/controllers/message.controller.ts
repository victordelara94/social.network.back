/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */
import { NextFunction, Request, Response } from 'express';
import { MessageRepository } from '../repository/message/message.repository';
import { UserRepository } from '../repository/user/user.repository';

export class MessageController {
  constructor(
    private messageRepo: MessageRepository,
    private userRepo: UserRepository
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const author = await this.userRepo.getById(req.body.validatedId);
      const to = await this.userRepo.getById(req.body.receiverId);
      const message = await this.messageRepo.create({
        author,
        to,
        content: req.body.content,
      });
      res.json(message);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.messageRepo.delete(req.params.id);
      res.status(204);
      res.json({});
    } catch (error) {
      next(error);
    }
  }

  async getConversationMessages(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const author = await this.userRepo.getById(req.body.validatedId);
      const receiver = await this.userRepo.getById(req.params.receiverId);
      const conversationMessages =
        await this.messageRepo.searchConversationMessages({
          author,
          receiver,
        });
      res.json(conversationMessages);
    } catch (error) {
      next(error);
    }
  }
}
