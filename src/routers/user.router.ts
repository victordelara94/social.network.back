/* eslint-disable no-unused-vars */
import createDebug from 'debug';
import express, { Router as createRouter } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { AuthVerificator } from '../middlewares/auth.verificator.js';
import { MulterMiddleware } from '../middlewares/multer.middleware.js';

const debug = createDebug('UserRouter');

export class UserRouter {
  router: express.Router;
  authInterceptor: AuthVerificator;
  multerMiddleware: MulterMiddleware;
  constructor(private controller: UserController) {
    debug('Instantiated');
    this.router = createRouter();
    this.authInterceptor = new AuthVerificator();
    this.multerMiddleware = new MulterMiddleware();
    this.configure();
  }

  configure() {
    this.router.post(
      '/register',
      this.multerMiddleware.singleFileStore('avatar'),
      this.controller.register.bind(this.controller)
    );
    this.router.patch('/login', this.controller.login.bind(this.controller));
    this.router.get(
      '/',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.controller.getAll.bind(this.controller)
    );
    this.router.get(
      '/search?',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.controller.search.bind(this.controller)
    );
    this.router.get(
      '/:id',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.controller.getById.bind(this.controller)
    );

    this.router.patch(
      '/follow',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.controller.follow.bind(this.controller)
    );
    this.router.patch(
      '/unfollow',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.controller.unfollow.bind(this.controller)
    );
    this.router.patch(
      '/:id',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.controller.update.bind(this.controller)
    );
  }
}
