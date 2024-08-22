import { singleton } from 'tsyringe';

import CourseRepository from '@repository/CourseRepository';

@singleton()
export default class CourseService {
  private courseRepository: CourseRepository;

  constructor(courseRepositroy: CourseRepository) {
    this.courseRepository = courseRepositroy;
  }
}
