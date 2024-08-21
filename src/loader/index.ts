import { Application, NextFunction } from 'express';
import { container } from 'tsyringe';

import CourseController from 'src/api/controller/CourseController';
import Mysql from './Mysql';
import logger from '@util/logger';

export default async (expressApp: Application): Promise<void> => {
  const mysqlPool = container.resolve(Mysql);
  await mysqlPool.testConnection();
  logger.info('Create Mysql Connection Pool: OK');

  const courseController = container.resolve(CourseController);

  expressApp.use('/courses', courseController.routes);

  expressApp.use((err: any, req: any, res: any, next: NextFunction) => {
    logger.error(err);
    res.status(500).send('Server Error');
  });
};
