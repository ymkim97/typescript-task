import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { STATUS_CODE } from '@constant/StatusConstant';

export default function queryValidationHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const errors = validationResult(req);

  if (errors.isEmpty()) return next();

  res
    .status(STATUS_CODE.BAD_REQUEST)
    .json({ paramErrorMessages: errors.array() });
}
