import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { NextFunction, Request, RequestHandler, Response } from 'express';

import { ERROR_MESSAGE } from '@constant/ErrorMessageConstant';
import { STATUS_CODE } from '@constant/StatusConstant';
import RequestError from '@error/RequestError';

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

export default function validateRequestBody(type: any): RequestHandler {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const plain = plainToInstance(type, req.body, {
        excludeExtraneousValues: true,
      });

      await validateOrReject(plain);

      next();
    } catch (errors) {
      const validationMessages = formatValidationErrors(
        errors as ValidationError[],
      );
      const requestError = new RequestError(
        ERROR_MESSAGE.REQUEST_VALIDATION,
        STATUS_CODE.BAD_REQUEST,
      );
      requestError.validationMessages = validationMessages;

      next(requestError);
    }
  };
}
