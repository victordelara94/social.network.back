/* eslint-disable no-unused-vars */
import bcrypt from 'bcrypt';
import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthVerificator } from '../middlewares/auth.verificator.js';
import { UserRepository } from '../repository/user/user.repository.js';
const debug = createDebug('SN:Controller:UserController');
export class UserController {
  constructor(private repo: UserRepository) {
    debug('instantiate');
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const saltRounds = 10;
      req.body.password = await bcrypt.hash(req.body.password, saltRounds);
      const data = await this.repo.create(req.body);
      res.status(201);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { userName, password } = req.body;
    const error = new Error('UnAuthorized Login unauthorized');
    try {
      const data = await this.repo.search({ key: 'userName', value: userName });

      if (!data.length) throw error;
      if (!(await bcrypt.compare(password, data[0].password))) {
        throw error;
      }

      const payload = {
        userName: data[0].userName,
        id: data[0].id,
      };

      const token = jwt.sign(payload, AuthVerificator.secret);
      res.json({ user: data[0], token });
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

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.repo.getById(req.params.id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      debug(req.body);
      const data = await this.repo.update(req.body.validatedId, req.body);
      debug(data);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}
