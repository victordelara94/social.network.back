import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';

import jwt from 'jsonwebtoken';

const debug = createDebug('SN:Middleware:auth');

debug('Loaded');
export class AuthVerificator {
  static secret = 'secret';
  authorizate(req: Request, _res: Response, next: NextFunction) {
    try {
      const token = req.get('Authorization')?.split(' ')[1];
      if (!token) throw new Error('Invalid token no token provided');
      //
      const result = jwt.verify(token, AuthVerificator.secret);

      if (typeof result === 'string') {
        throw new Error('Invalid token');
      }

      const { id } = result.token;
      req.body.validatedId = id;
      debug('authorizate');
      next();
    } catch (error) {
      next(error);
    }
  }
}
