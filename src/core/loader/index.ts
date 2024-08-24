import { Application, NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';

import SqlError from '@error/SqlError';
import RequestError from '@error/RequestError';
import NotFoundError from '@error/NotFoundError';

import Mysql from './Mysql';
import logger from '@util/logger';
import CourseRoute from '@route/CourseRoute';
import CourseController from '@controller/CourseController';
import { ERROR_CODE, ERROR_MESSAGE } from '@constant/ErrorConstant';

export default async (expressApp: Application): Promise<void> => {
  const mysqlPool = container.resolve(Mysql);
  await mysqlPool.testConnection();
  logger.info('Create Mysql Connection Pool: OK');

  container.registerSingleton(CourseController);
  const courseRoute = container.resolve(CourseRoute);

  expressApp.use('/courses', courseRoute.routes);

  expressApp.use(
    (err: Error, req: Request, res: Response, next: NextFunction) => {
      logger.error(err);

      if (err instanceof SqlError) {
        return res.status(ERROR_CODE.SERVER_ERROR).send(err.message);
      } else if (err instanceof RequestError) {
        logger.error(err.errorMessages);
        return res.status(ERROR_CODE.REQUEST_ERROR).send(err.errorMessages);
      } else if (err instanceof NotFoundError) {
        return res.status(ERROR_CODE.NOT_FOUND_ERROR).send(err.message);
      }

      return res
        .status(ERROR_CODE.SERVER_ERROR)
        .send(ERROR_MESSAGE.SERVER_ERROR);
    },
  );
};
