import express from 'express';

import logger from '@config/logger';

function wrapSyncApi(
  fn: (
    req: Request,
    res: Response,
    next: express.NextFunction,
  ) => Promise<void>,
) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

export default (app: express.Application): void => {
  app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
  });

  app.use((err, req, res, next) => {
    logger.error(err);
    res.status(500).send('Server Error');
  });
};
