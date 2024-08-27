import { Request, Response, Router } from 'express';
import { singleton } from 'tsyringe';

import StudentController from '@controller/StudentController';
import SignUpStudentRequest from '@dto/request/SignUpStudentRequest';
import wrapAsync from '@util/wrapAsync';
import validateRequestBody from '../validation/validateRequestBody';

@singleton()
export default class StudentRoute {
  private studentController: StudentController;
  private router: Router;

  constructor(studentController: StudentController) {
    this.studentController = studentController;
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
      wrapAsync(async (req: Request, res: Response) => {
        await this.studentController.withdrawStudent(req, res);
      }),
    );
  }
}
