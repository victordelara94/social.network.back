/* eslint-disable no-unused-vars */
import createDebug from 'debug';
import express, { Router as createRouter } from 'express';
import { PostController } from '../controllers/post.controller.js';
import { AuthVerificator } from '../middlewares/auth.verificator.js';
import { MulterMiddleware } from '../middlewares/multer.middleware.js';

const debug = createDebug('postRouter');

export class PostRouter {
  router: express.Router;
  authInterceptor: AuthVerificator;
  multerMiddleware: MulterMiddleware;
  constructor(private controller: PostController) {
    debug('Instantiated');
    this.router = createRouter();
    this.authInterceptor = new AuthVerificator();
    this.multerMiddleware = new MulterMiddleware();
    this.configure();
  }

  configure() {
    this.router.get(
      '/',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.controller.getAll.bind(this.controller)
    );

    this.router.post(
      '/',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.multerMiddleware.singleFileStore('image'),
      this.controller.create.bind(this.controller)
    );
    this.router.patch(
      '/comment/:id',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.controller.addComment.bind(this.controller)
    );
    this.router.patch(
      '/:id',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.controller.update.bind(this.controller)
    );
  }
}
