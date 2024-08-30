import express, { Application, NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';

import NotFoundError from '@error/NotFoundError';
import RequestError from '@error/RequestError';
import SqlError from '@error/SqlError';

import { ERROR_MESSAGE } from '@constant/ErrorMessageConstant';
import { STATUS_CODE } from '@constant/StatusConstant';
import CourseRoute from '@route/CourseRoute';
import StudentRoute from '@route/StudentRoute';
import logger from '@util/logger';

export default function getApp(): Application {
  const app = express();

  app.use(express.json());

  const courseRoute = container.resolve(CourseRoute);
  const studentRoute = container.resolve(StudentRoute);

  app.use('/courses', courseRoute.routes);
  app.use('/students', studentRoute.routes);

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.stack);

    if (err instanceof SqlError) {
      return res
        .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({ errorMessage: err.message });
    } else if (err instanceof RequestError) {
      if (err.validationMessages) {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ errorMessage: err.validationMessages });
      } else {
        return res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ errorMessage: err.message });
      }
    } else if (err instanceof NotFoundError) {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .json({ errorMessage: err.message });
    }

    return res
      .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json({ errorMessage: ERROR_MESSAGE.SERVER_ERROR });
  });

  return app;
}
