import cors from 'cors';
import createDebug from 'debug';
import express from 'express';
import morgan from 'morgan';
import { Server } from 'socket.io';
import { CommentController } from './controllers/comment.controller.js';
import { MessageController } from './controllers/message.controller.js';
import { PostController } from './controllers/post.controller.js';
import { UserController } from './controllers/user.controller.js';
import { CommentRepository } from './repository/comment/comment.repository.js';
import { MessageRepository } from './repository/message/message.repository.js';
import { PostRepository } from './repository/post/post.repository.js';
import { UserRepository } from './repository/user/user.repository.js';
import { CommentRouter } from './routers/comment.router.js';
import { MessageRouter } from './routers/message.router.js';
import { PostRouter } from './routers/post.router.js';
import { UserRouter } from './routers/user.router.js';
import { SocketService } from './services/socket.service.js';

const debug = createDebug('SN:App');
export const app = express();
export const io = new Server();
debug('APP:Started');

app.use(morgan('dev'));
app.use(cors());

app.use(express.json());
app.use(express.static('public'));
const userRepository = new UserRepository();
const userController = new UserController(userRepository);
const userRouter = new UserRouter(userController);
app.use('/users', userRouter.router);
const postRepository = new PostRepository();
const postController = new PostController(postRepository, userRepository);
const postRouter = new PostRouter(postController);
app.use('/posts', postRouter.router);
const commentRepository = new CommentRepository();
const commentController = new CommentController(
  commentRepository,
  userRepository,
  postRepository
);
const commentRouter = new CommentRouter(commentController);
app.use('/comments', commentRouter.router);
const messageRepository = new MessageRepository();
const messageController = new MessageController(
  messageRepository,
  userRepository
);
export const ioService = new SocketService(io, messageController);
const messageRouter = new MessageRouter(messageController);
app.use('/messages', messageRouter.router);
