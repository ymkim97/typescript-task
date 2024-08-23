import { Router, Request, Response, NextFunction } from 'express';
import { singleton } from 'tsyringe';

import CourseController from '@controller/CourseController';
import { validateBody } from '../validation/validateBody';
import { CreateCourseRequest } from '@dto/request/createCourseRequest';

@singleton()
export default class CourseRoute {
  private courseController: CourseController;
  private router: Router;

  constructor(courseController: CourseController) {
    this.courseController = courseController;
    this.router = Router();

    this.initializeRoutes();
  }

  public get routes() {
    return this.router;
  }

  private initializeRoutes(): void {
    this.router.get(
      '/',
      this.wrapAsync(async (req: Request, res: Response) => {
        await this.courseController.searchCourses(req, res);
      }),
    );

    this.router.get(
      '/:id',
      this.wrapAsync(async (req: Request, res: Response) => {
        await this.courseController.searchCourse(req, res);
      }),
    );

    this.router.post(
      '/',
      validateBody(CreateCourseRequest),
      this.wrapAsync(async (req: Request, res: Response) => {
        await this.courseController.registerCourse(req, res);
      }),
    );
  }

  private wrapAsync(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
  ) {
    return (req: Request, res: Response, next: NextFunction) =>
      Promise.resolve(fn(req, res, next)).catch(next);
  }
}
