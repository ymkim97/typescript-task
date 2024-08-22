import { Response, Request } from 'express';
import { singleton } from 'tsyringe';

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
    // TODO: Validation
    const courseId = parseInt(req.params.id, 10);

    const courseDetails = await this.searchService.getCourseDetails(courseId);
    res.status(200).send(JSON.stringify(courseDetails));
  }
}
