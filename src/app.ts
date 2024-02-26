import cors from 'cors';
import createDebug from 'debug';
import express from 'express';
import morgan from 'morgan';
import { Server } from 'socket.io';
import { CommentController } from './controllers/comment.controller.js';
import { PostController } from './controllers/post.controller.js';
import { ResponseController } from './controllers/response.controller.js';
import { UserController } from './controllers/user.controller.js';
import { CommentRepository } from './repository/comment/comment.repository.js';
import { PostRepository } from './repository/post/post.repository.js';
import { ResponseRepository } from './repository/response/response.repository.js';
import { UserRepository } from './repository/user/user.repository.js';
import { CommentRouter } from './routers/comment.router.js';
import { PostRouter } from './routers/post.router.js';
import { ResponseRouter } from './routers/response.router.js';
import { UserRouter } from './routers/user.router.js';

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
const responseRepository = new ResponseRepository();
const responseController = new ResponseController(
  responseRepository,
  userRepository,
  commentRepository
);
const responseRouter = new ResponseRouter(responseController);
app.use('/responses', responseRouter.router);
