import { Router, Request, Response, NextFunction } from 'express';
import { singleton } from 'tsyringe';

import CourseController from '@controller/CourseController';

@singleton()
class CourseRoute {
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
  }

  private wrapAsync(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
  ) {
    return (req: Request, res: Response, next: NextFunction) =>
      Promise.resolve(fn(req, res, next)).catch(next);
  }
}

export default CourseRoute;
