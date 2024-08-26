import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { singleton } from 'tsyringe';

import CreateBulkCourseRequest from '@dto/request/CreateBulkCourseRequest';
import CreateCourseRequest from '@dto/request/CreateCourseRequest';
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
    res.status(200).send('OK');
  }

  public async searchCourse(req: Request, res: Response): Promise<void> {
    const courseId = parseInt(req.params.id, 10);
    const courseDetailsResponse =
      await this.searchService.getCourseDetails(courseId);

    res.status(200).send(instanceToPlain(courseDetailsResponse) || {});
  }

  public async registerCourse(req: Request, res: Response): Promise<void> {
    const createCourseRequest = plainToInstance(CreateCourseRequest, req.body);
    const createdCourseId =
      await this.courseService.registerNew(createCourseRequest);

    res.status(201).send(JSON.stringify({ insertedCourseId: createdCourseId }));
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
      .status(201)
      .send(JSON.stringify({ insertedCourseIds: createdCourseIds }));
  }

  public async updateCourse(req: Request, res: Response): Promise<void> {
    const courseId = parseInt(req.params.id, 10);
    const updateCourseRequest = plainToInstance(UpdateCourseRequest, req.body);

    await this.courseService.update(courseId, updateCourseRequest);

    res.status(200).send(JSON.stringify({ updatedCourseId: courseId }));
  }

  public async openCourse(req: Request, res: Response): Promise<void> {
    const courseId = parseInt(req.params.id, 10);
    const openCourseRequest = plainToInstance(OpenCourseRequest, req.body);

    await this.courseService.open(courseId, openCourseRequest);

    res.status(200).send(JSON.stringify({ openedCourseId: courseId }));
  }
}
