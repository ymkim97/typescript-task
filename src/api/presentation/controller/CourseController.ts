import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Response, Request } from 'express';
import { singleton } from 'tsyringe';

import CourseService from '@service/CourseService';
import SearchService from '@service/SearchService';
import { CreateCourseRequest } from '@dto/request/CreateCourseRequest';

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

    res.status(200).send(JSON.stringify({ insertedCourseId: createdCourseId }));
  }
}
