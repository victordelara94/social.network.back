import createDebug from 'debug';
import mongoose from 'mongoose';

import { clusterSubdomain, password, user } from '../config.js';
const debug = createDebug('db');
export const dbConnect = () => {
  const db = 'socialnetwork';
  const uri = `mongodb+srv://${user}:${password}@cluster0.${clusterSubdomain}.mongodb.net/${db}?retryWrites=true&w=majority`;
  debug('db');
  return mongoose.connect(uri);
};

dbConnect();
