import { Request, Response, Router } from 'express';
import { param, query } from 'express-validator';
import { singleton } from 'tsyringe';

import { CATEGORY_VALUES } from '@constant/CourseConstant';
import { ERROR_MESSAGE } from '@constant/ErrorMessageConstant';
import CourseController from '@controller/CourseController';
import CreateBulkCourseRequest from '@dto/request/CreateBulkCourseRequest';
import CreateCourseRequest from '@dto/request/CreateCourseRequest';
import DeleteCourseRequest from '@dto/request/DeleteCourseRequest';
import OpenCourseRequest from '@dto/request/OpenCourseRequest';
import UpdateCourseRequest from '@dto/request/UpdateCourseRequest';
import wrapAsync from '@util/wrapAsync';
import queryValidationHandler from '../validation/queryValidationHandler';
import validateRequestBody from '../validation/validateRequestBody';

@singleton()
export default class CourseRoute {
  private router: Router;

  constructor(private readonly courseController: CourseController) {
    this.router = Router();

    this.initializeRoutes();
  }

  public get routes() {
    return this.router;
  }

  private initializeRoutes(): void {
    this.router.get(
      '/search',
      query('type').custom(async (value) => {
        if (value !== 'instructorAndTitle' && value !== 'studentId') {
          throw new Error(ERROR_MESSAGE.REQUEST_SEARCH_QUERY);
        }
      }),
      query('keyword')
        .notEmpty()
        .withMessage(ERROR_MESSAGE.REQUEST_SEARCH_QUERY),
      query('category')
        .toUpperCase()
        .custom(async (value) => {
          if (value != 'ALL' && !Object.keys(CATEGORY_VALUES).includes(value)) {
            throw new Error(ERROR_MESSAGE.REQUEST_SEARCH_QUERY);
          }
        }),
      query('pageNumber')
        .isNumeric()
        .withMessage(ERROR_MESSAGE.REQUEST_SEARCH_QUERY),
      query('pageSize')
        .isNumeric()
        .withMessage(ERROR_MESSAGE.REQUEST_SEARCH_QUERY),
      query('sort').custom(async (value) => {
        if (value != 'recent' && value != 'student-count') {
          throw new Error(ERROR_MESSAGE.REQUEST_SEARCH_QUERY);
        }
      }),
      queryValidationHandler,
      wrapAsync(async (req: Request, res: Response) => {
        await this.courseController.searchCourses(req, res);
      }),
    );

    this.router.get(
      '/:id',
      param('id').isNumeric(),
      queryValidationHandler,
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
      param('id').isNumeric(),
      queryValidationHandler,
      validateRequestBody(UpdateCourseRequest),
      wrapAsync(async (req: Request, res: Response) => {
        await this.courseController.updateCourse(req, res);
      }),
    );

    this.router.put(
      '/open/:id',
      param('id').isNumeric(),
      queryValidationHandler,
      validateRequestBody(OpenCourseRequest),
      wrapAsync(async (req: Request, res: Response) => {
        await this.courseController.openCourse(req, res);
      }),
    );

    this.router.delete(
      '/:id',
      param('id').isNumeric(),
      queryValidationHandler,
      validateRequestBody(DeleteCourseRequest),
      wrapAsync(async (req: Request, res: Response) => {
        await this.courseController.deleteCourse(req, res);
      }),
    );
  }
}
