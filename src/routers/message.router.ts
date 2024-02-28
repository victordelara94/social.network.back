import createDebug from 'debug';
import express, { Router as createRouter } from 'express';
import { MessageController } from '../controllers/message.controller.js';
import { AuthVerificator } from '../middlewares/auth.verificator.js';

const debug = createDebug('messageRouter');

export class MessageRouter {
  router: express.Router;
  authInterceptor: AuthVerificator;

  // eslint-disable-next-line no-unused-vars
  constructor(private controller: MessageController) {
    debug('Instantiated');
    this.router = createRouter();
    this.authInterceptor = new AuthVerificator();
    this.configure();
  }

  configure() {
    this.router.post(
      '/',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.controller.create.bind(this.controller)
    );
    this.router.get(
      '/:receiverId',
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.controller.getConversationMessages.bind(this.controller)
    );
    this.router.delete(
      '/:id',
      this.authInterceptor.messageAuthentication.bind(this.authInterceptor),
      this.authInterceptor.authorizate.bind(this.authInterceptor),
      this.controller.delete.bind(this.controller)
    );
  }
}
