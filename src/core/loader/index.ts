import { Application, NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';

import Mysql from './Mysql';
import logger from '@util/logger';
import CourseRoute from '@route/CourseRoute';
import NotFoundError from '@error/NotFoundError';
import CourseController from '@controller/CourseController';

export default async (expressApp: Application): Promise<void> => {
  const mysqlPool = container.resolve(Mysql);
  await mysqlPool.testConnection();
  logger.info('Create Mysql Connection Pool: OK');

  container.registerSingleton(CourseController);
  const courseRoute = container.resolve(CourseRoute);

  expressApp.use('/courses', courseRoute.routes);

  expressApp.use(
    (err: Error, req: Request, res: Response, next: NextFunction) => {
      logger.error(err.stack);

      if (err instanceof NotFoundError)
        return res.status(404).send(NotFoundError.DATA_NOT_FOUND);

      return res.status(500).send('Server Error');
    },
  );
};
