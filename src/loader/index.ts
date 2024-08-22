import { Application, NextFunction } from 'express';
import { container } from 'tsyringe';

import CourseRoute from '@route/CourseRoute';
import CourseController from '@controller/CourseController';
import Mysql from './Mysql';
import logger from '@util/logger';

export default async (expressApp: Application): Promise<void> => {
  const mysqlPool = container.resolve(Mysql);
  await mysqlPool.testConnection();
  logger.info('Create Mysql Connection Pool: OK');

  container.registerSingleton(CourseController);
  const courseRoute = container.resolve(CourseRoute);

  expressApp.use('/courses', courseRoute.routes);

  expressApp.use((err: any, req: any, res: any, next: NextFunction) => {
    logger.error(err);
    res.status(500).send('Server Error');
  });
};
