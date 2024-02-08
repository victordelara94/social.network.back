import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
const debug = createDebug('SN:MulterMiddleware');

export class MulterMiddleware {
  constructor() {
    debug('Instantiated');
  }

  singleFileStore(fileName: string) {
    debug(fileName, 'filename');
    const storage = multer.diskStorage({
      destination: './uploads',
      filename(_req, file, callback) {
        callback(null, file.originalname);
      },
    });
    debug('PreUpload', storage);
    const upload = multer({ storage });
    debug('multer()', upload);
    const middleware = upload.single(fileName);
    debug('POST UPLOAD:SINGLE');
    return (req: Request, res: Response, next: NextFunction) => {
      const prevBody = req.body;
      middleware(req, res, next);
      req.body = { ...prevBody, ...req.body };
    };
  }
}
