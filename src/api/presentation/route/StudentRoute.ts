import { Request, Response, Router } from 'express';
import { param } from 'express-validator';
import { singleton } from 'tsyringe';

import StudentController from '@controller/StudentController';
import ApplyClassRequest from '@dto/request/ApplyClassRequest';
import SignUpStudentRequest from '@dto/request/SignUpStudentRequest';
import wrapAsync from '@util/wrapAsync';
import queryValidationHandler from '../validation/queryValidationHandler';
import validateRequestBody from '../validation/validateRequestBody';

@singleton()
export default class StudentRoute {
  private router: Router;

  constructor(private readonly studentController: StudentController) {
    this.router = Router();

    this.initializeRoutes();
  }

  public get routes() {
    return this.router;
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      validateRequestBody(SignUpStudentRequest),
      wrapAsync(async (req: Request, res: Response) => {
        await this.studentController.signUpStudent(req, res);
      }),
    );

    this.router.delete(
      '/:id',
      param('id').isNumeric(),
      queryValidationHandler,
      wrapAsync(async (req: Request, res: Response) => {
        await this.studentController.withdrawStudent(req, res);
      }),
    );

    this.router.post(
      '/apply-class',
      validateRequestBody(ApplyClassRequest),
      wrapAsync(async (req: Request, res: Response) => {
        await this.studentController.applyClass(req, res);
      }),
    );
  }
}
