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
      '/:id',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.controller.create.bind(this.controller)
    );
  }
}
