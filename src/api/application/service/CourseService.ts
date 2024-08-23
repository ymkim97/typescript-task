import { singleton } from 'tsyringe';

import CourseRepository from '@repository/CourseRepository';

@singleton()
export default class CourseService {
  private courseRepository: CourseRepository;

  constructor(courseRepository: CourseRepository) {
    this.courseRepository = courseRepository;
  }
}
