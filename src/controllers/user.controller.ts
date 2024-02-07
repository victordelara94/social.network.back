/* eslint-disable no-unused-vars */
import bcrypt from 'bcrypt';
import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthVerificator } from '../middlewares/auth.verificator.js';
import { UserRepository } from '../repository/user/user.repository.js';
import { CloudinaryService } from '../services/cloudinary.service.js';

const debug = createDebug('SN:Controller:UserController');
export class UserController {
  cloudinary: CloudinaryService;
  constructor(private repo: UserRepository) {
    this.cloudinary = new CloudinaryService();
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) throw new Error('Not received a photo');
      const path = req.file.destination + '/' + req.file.filename;
      const image = await this.cloudinary.uploadImage(path);
      req.body.avatar = image;
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

  async search(req: Request, res: Response, next: NextFunction) {
    try {
      if (
        typeof req.query.key === 'string' &&
        typeof req.query.value !== 'undefined'
      ) {
        const data = await this.repo.search({
          key: req.query.key,
          value: req.query.value,
        });
        res.json(data);
      } else {
        res.status(400).json({ error: 'Invalid parameters' });
      }
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
}
