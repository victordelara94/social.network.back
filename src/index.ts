import createDebug from 'debug';
import { createServer } from 'http';
import mongoose from 'mongoose';
import { app, ioService } from './app.js';
import { dbConnect } from './db/db.js';

const debug = createDebug('SN:INDEX');
const PORT = process.env.PORT ?? 3000;

const server = createServer(app);
dbConnect()
  .then(() => {
    ioService.on();
    server.listen(PORT);
    mongoose.connection.on('connected', () => {
      debug('Connected to DB:', mongoose.connection.db.databaseName);
    });
  })
  .catch((error) => {
    server.emit('error', error);
  });

server.on('listening', () => {
  const addressInfo = server.address();
  if (addressInfo === null) {
    server.emit('error', new Error('Invalid network address'));
    return;
  }

  let bind: string;
  if (typeof addressInfo === 'string') {
    bind = 'pipe ' + addressInfo;
  } else {
    bind =
      addressInfo.address === '::'
        ? `http://localhost:${addressInfo?.port}`
        : `port ${addressInfo?.port}`;
  }

  debug('Listening');
  debug(`Listening on ${bind}`);
});
server.on('error', (error) => {
  debug(`Error,${error.message} `);
});
