/* eslint-disable no-unused-vars */
import createDebug from 'debug';
import express, { Router as createRouter } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { AuthVerificator } from '../middlewares/auth.verificator.js';

const debug = createDebug('GLRouter:UserRouter');

export class UserRouter {
  router: express.Router;
  authInterceptor: AuthVerificator;
  constructor(private controller: UserController) {
    debug('Instantiated');
    this.router = createRouter();
    this.authInterceptor = new AuthVerificator();
    this.configure();
  }

  configure() {
    this.router.get(
      '/',
      this.authInterceptor.authorizate.bind(this.authInterceptor),

      this.controller.getAll.bind(this.controller)
    );
    this.router.get(
      '/:id',
      this.authInterceptor.authorizate.bind(this.authInterceptor),

      this.controller.getById.bind(this.controller)
    );
    this.router.post(
      '/register',
      this.controller.register.bind(this.controller)
    );
    this.router.patch('/login', this.controller.login.bind(this.controller));
  }
}
