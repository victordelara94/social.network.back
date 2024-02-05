import cors from 'cors';
import createDebug from 'debug';
import express from 'express';
import morgan from 'morgan';

const debug = createDebug('SN:App');
export const app = express();

debug('APP:Started');

app.use(morgan('dev'));
app.use(cors());

app.use(express.json());
app.use(express.static('public'));
