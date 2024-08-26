import { Request, Response, Router } from 'express';
import { singleton } from 'tsyringe';

import CourseController from '@controller/CourseController';
import CreateBulkCourseRequest from '@dto/request/CreateBulkCourseRequest';
import CreateCourseRequest from '@dto/request/CreateCourseRequest';
import DeleteCourseRequest from '@dto/request/DeleteCourseRequest';
import OpenCourseRequest from '@dto/request/OpenCourseRequest';
import UpdateCourseRequest from '@dto/request/UpdateCourseRequest';
import wrapAsync from '@util/wrapAsync';
import validateRequestBody from '../validation/validateRequestBody';

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
      wrapAsync(async (req: Request, res: Response) => {
        await this.courseController.searchCourses(req, res);
      }),
    );

    this.router.get(
      '/:id',
      wrapAsync(async (req: Request, res: Response) => {
        await this.courseController.searchCourse(req, res);
      }),
    );

    this.router.post(
      '/',
      validateRequestBody(CreateCourseRequest),
      wrapAsync(async (req: Request, res: Response) => {
        await this.courseController.registerCourse(req, res);
      }),
    );

    this.router.post(
      '/bulk',
      validateRequestBody(CreateBulkCourseRequest),
      wrapAsync(async (req: Request, res: Response) => {
        await this.courseController.registerBulkCourse(req, res);
      }),
    );

    this.router.put(
      '/:id',
      validateRequestBody(UpdateCourseRequest),
      wrapAsync(async (req: Request, res: Response) => {
        await this.courseController.updateCourse(req, res);
      }),
    );

    this.router.put(
      '/open/:id',
      validateRequestBody(OpenCourseRequest),
      wrapAsync(async (req: Request, res: Response) => {
        await this.courseController.openCourse(req, res);
      }),
    );

    this.router.delete(
      '/:id',
      validateRequestBody(DeleteCourseRequest),
      wrapAsync(async (req: Request, res: Response) => {
        await this.courseController.deleteCourse(req, res);
      }),
    );
  }
}
