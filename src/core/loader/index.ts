import { Application, NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';

import Mysql from './Mysql';
import logger from '@util/logger';
import CourseRoute from '@route/CourseRoute';
import RequestError from '@error/RequestError';
import NotFoundError from '@error/NotFoundError';
import CourseController from '@controller/CourseController';
import { ERROR_CODE, ERROR_MESSAGE } from '@constant/ErrorMessage';

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

      if (err instanceof NotFoundError) {
        return res
          .status(ERROR_CODE.NOT_FOUND_ERROR)
          .send(ERROR_MESSAGE.DATA_NOT_FOUND);
      } else if (err instanceof RequestError) {
        logger.error(err.errorMessages);
        return res.status(ERROR_CODE.REQUEST_ERROR).send(err.errorMessages);
      }

      return res
        .status(ERROR_CODE.SERVER_ERROR)
        .send(ERROR_MESSAGE.SERVER_ERROR);
    },
  );
};
