import { Request, Response, NextFunction, RequestHandler } from 'express';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';

import RequestError from '@error/RequestError';
import { ERROR_CODE, ERROR_MESSAGE } from '@constant/ErrorMessage';

function formatValidationErrors(errors: ValidationError[]): string[] {
  const errorMessages: string[] = [];

  Object.values(errors).forEach((error) => {
    if (error.constraints) {
      Object.values(error.constraints).forEach((message) => {
        errorMessages.push(message);
      });
    }

    if (error.children) {
      errorMessages.push(...formatValidationErrors(error.children));
    }
  });

  return errorMessages;
}

export function validateBody(type: { new (): any }): RequestHandler {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const plain = plainToInstance(type, req.body, {
        excludeExtraneousValues: true,
      });
      await validateOrReject(plain);
      console.log(plain);
      next();
    } catch (errors) {
      const errorMessages = formatValidationErrors(errors as ValidationError[]);
      const requestError = new RequestError(
        ERROR_MESSAGE.REQUEST_VALIDATION,
        ERROR_CODE.REQUEST_ERROR,
      );
      requestError.errorMessages = errorMessages;

      next(requestError);
    }
  };
}
