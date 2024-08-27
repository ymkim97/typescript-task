import { singleton } from 'tsyringe';

import CourseDetailsResponse from '@dto/response/CourseDetailsResponse';
import ClassRepository from '@repository/ClassRepository';
import CourseRepository from '@repository/CourseRepository';

@singleton()
export default class SearchService {
  private courseRepository: CourseRepository;
  private classRepository: ClassRepository;

  constructor(
    courseRepository: CourseRepository,
    classRepository: ClassRepository,
  ) {
    this.courseRepository = courseRepository;
    this.classRepository = classRepository;
  }

  public async getCourseDetails(
    id: number,
  ): Promise<CourseDetailsResponse | void> {
    const course = await this.courseRepository.findById(id);

    if (!course) return;

    const classAndStudents =
      await this.classRepository.findAllWithStudentsByCourseId(id);

    return CourseDetailsResponse.from(course, classAndStudents);
  }
}
