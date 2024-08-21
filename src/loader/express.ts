import express, { NextFunction } from 'express';

import logger from '@config/logger';

function wrapSyncApi(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);
}

export default (app: express.Application): void => {
  app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
  });

  app.use((err: any, req: any, res: any, next: NextFunction) => {
    logger.error(err);
    res.status(500).send('Server Error');
  });
};
