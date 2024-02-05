import createDebug from 'debug';
import mongoose from 'mongoose';

import { password, user } from '../config.js';
const debug = createDebug('GL:db');
export const dbConnect = () => {
  const db = 'socialnetwork';
  const uri = `mongodb+srv://${user}:${password}@cluster0.wyzrngt.mongodb.net/${db}?retryWrites=true&w=majority`;
  debug('db');
  return mongoose.connect(uri);
};

dbConnect();
