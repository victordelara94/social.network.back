/* eslint-disable no-unused-vars */
import createDebug from 'debug';
import express, { Router as createRouter } from 'express';
import { CommentController } from '../controllers/comment.controller.js';
import { AuthVerificator } from '../middlewares/auth.verificator.js';

const debug = createDebug('CommentRouter');

export class CommentRouter {
  router: express.Router;
  authInterceptor: AuthVerificator;

  constructor(private controller: CommentController) {
    debug('Instantiated');
    this.router = createRouter();
    this.authInterceptor = new AuthVerificator();
    this.configure();
  }

  configure() {
    this.router.post(
      '/intoComment',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.controller.createIntoComment.bind(this.controller)
    );
    this.router.post(
      '/intoPost',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.controller.createIntoPost.bind(this.controller)
    );
    this.router.patch(
      '/likes/:id',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.controller.addLike.bind(this.controller)
    );
    this.router.patch(
      '/dislikes/:id',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.controller.dislike.bind(this.controller)
    );
    this.router.patch(
      '/',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.controller.editComment.bind(this.controller)
    );
    this.router.delete(
      '/:id',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.controller.deleteComment.bind(this.controller)
    );
  }
}
