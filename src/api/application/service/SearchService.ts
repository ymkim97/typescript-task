import { singleton } from 'tsyringe';

import { GetCourseDetailsResponse } from '@dto/response/GetCourseDetailsResponse';
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
  ): Promise<GetCourseDetailsResponse | void> {
    const course = await this.courseRepository.findById(id);

    if (!course) return;

    const classAndStudent =
      await this.classRepository.findWithStudentByCourseId(id);

    return GetCourseDetailsResponse.mapToCourseDetailsResponse(
      course,
      classAndStudent,
    );
  }
}
