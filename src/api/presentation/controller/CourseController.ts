import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { singleton } from 'tsyringe';

import { STATUS_CODE } from '@constant/StatusConstant';
import CreateBulkCourseRequest from '@dto/request/CreateBulkCourseRequest';
import CreateCourseRequest from '@dto/request/CreateCourseRequest';
import DeleteCourseRequest from '@dto/request/DeleteCourseRequest';
import OpenCourseRequest from '@dto/request/OpenCourseRequest';
import UpdateCourseRequest from '@dto/request/UpdateCourseRequest';
import CourseService from '@service/CourseService';
import SearchService from '@service/SearchService';

@singleton()
export default class CourseController {
  private courseService: CourseService;
  private searchService: SearchService;

  constructor(courseService: CourseService, searchService: SearchService) {
    this.courseService = courseService;
    this.searchService = searchService;
  }

  // TODO: 강의 목록 조회
  public async searchCourses(req: Request, res: Response): Promise<void> {
    res.status(STATUS_CODE.OK).send('OK');
  }

  public async searchCourse(req: Request, res: Response): Promise<void> {
    const courseId = parseInt(req.params.id, 10);
    const courseDetailsResponse =
      await this.searchService.getCourseDetails(courseId);

    res
      .status(STATUS_CODE.OK)
      .send(instanceToPlain(courseDetailsResponse) || {});
  }

  public async registerCourse(req: Request, res: Response): Promise<void> {
    const createCourseRequest = plainToInstance(CreateCourseRequest, req.body);
    const createdCourseId =
      await this.courseService.registerNew(createCourseRequest);

    res
      .status(STATUS_CODE.CREATED)
      .send(JSON.stringify({ insertedCourseId: createdCourseId }));
  }

  public async registerBulkCourse(req: Request, res: Response): Promise<void> {
    const createBulkCourseRequest = plainToInstance(
      CreateBulkCourseRequest,
      req.body,
    );
    const createdCourseIds = await this.courseService.registerNewBulk(
      createBulkCourseRequest,
    );

    res
      .status(STATUS_CODE.CREATED)
      .send(JSON.stringify({ insertedCourseIds: createdCourseIds }));
  }

  public async updateCourse(req: Request, res: Response): Promise<void> {
    const courseId = parseInt(req.params.id, 10);
    const updateCourseRequest = plainToInstance(UpdateCourseRequest, req.body);

    await this.courseService.update(courseId, updateCourseRequest);

    res
      .status(STATUS_CODE.OK)
      .send(JSON.stringify({ updatedCourseId: courseId }));
  }

  public async openCourse(req: Request, res: Response): Promise<void> {
    const courseId = parseInt(req.params.id, 10);
    const openCourseRequest = plainToInstance(OpenCourseRequest, req.body);

    await this.courseService.open(courseId, openCourseRequest);

    res
      .status(STATUS_CODE.OK)
      .send(JSON.stringify({ openedCourseId: courseId }));
  }

  public async deleteCourse(req: Request, res: Response): Promise<void> {
    const courseId = parseInt(req.params.id, 10);
    const deleteCourseRequest = plainToInstance(DeleteCourseRequest, req.body);

    await this.courseService.delete(courseId, deleteCourseRequest);

    res
      .status(STATUS_CODE.OK)
      .send(JSON.stringify({ deletedCourseId: courseId }));
  }
}
