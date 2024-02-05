import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
// Import { Auth } from '../services/auth.js';
import jwt from 'jsonwebtoken';
const debug = createDebug('SN:Middleware:auth');

debug('Loaded');
export class AuthInterceptor {
  private secret = 'secret';
  authorizate(req: Request, _res: Response, next: NextFunction) {
    try {
      const token = req.get('Authorization')?.split(' ')[1];
      if (!token) throw new Error('Invalid token no token provided');
      //
      const result = jwt.verify(token, this.secret);

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

//   Async authentication(req: Request, _res: Response, next: NextFunction) {
//     const userID = req.body.validatedId;

//     try {
//       const repo = new UserRepository();
//       const user = await repo.getById(userID);

//       if (user.id !== userID) {
//         const error = new HttpError(403, 'Forbidden', 'Not same user');
//         next(error);
//       }

//       next();
//     } catch (error) {
//       next(error);
//     }
//   }
// }
