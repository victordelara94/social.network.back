import createDebug from 'debug';
import 'dotenv/config';
import mongoose from 'mongoose';

const debug = createDebug('GL:db');
export const dbConnect = async () => {
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const dbName = 'socialnetwork';
  const uri = `mongodb+srv://${user}:${password}@cluster0.wyzrngt.mongodb.net/${dbName}?retryWrites=true&w=majority`;
  debug('SN:db');
  return mongoose.connect(uri);
};
