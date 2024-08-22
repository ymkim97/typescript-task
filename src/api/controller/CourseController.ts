import { Response, Request } from 'express';
import { singleton } from 'tsyringe';

import CourseService from '../service/CourseService';

@singleton()
class CourseController {
  private courseService: CourseService;

  constructor(courseService: CourseService) {
    this.courseService = courseService;
  }

  public async searchCourses(req: Request, res: Response): Promise<void> {
    this.courseService.test();
    res.status(200).send('OK');
  }
}

export default CourseController;
