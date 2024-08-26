import { Application, NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';

import NotFoundError from '@error/NotFoundError';
import RequestError from '@error/RequestError';
import SqlError from '@error/SqlError';

import { ERROR_MESSAGE } from '@constant/ErrorMessageConstant';
import { STATUS_CODE } from '@constant/StatusConstant';
import CourseController from '@controller/CourseController';
import CourseRoute from '@route/CourseRoute';
import logger from '@util/logger';
import Mysql from './Mysql';

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

      if (err instanceof SqlError) {
        return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).send(err.message);
      } else if (err instanceof RequestError) {
        if (err.validationMessages) {
          logger.error(err.validationMessages);

          return res
            .status(STATUS_CODE.BAD_REQUEST)
            .send(err.validationMessages);
        } else {
          return res.status(STATUS_CODE.BAD_REQUEST).send(err.message);
        }
      } else if (err instanceof NotFoundError) {
        return res.status(STATUS_CODE.NOT_FOUND).send(err.message);
      }

      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .send(ERROR_MESSAGE.SERVER_ERROR);
    },
  );
};
