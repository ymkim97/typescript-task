import { singleton } from 'tsyringe';

import { getCourseDetailsResponse } from '@dto/response/getCourseDetailsResponse';
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

  public async getCourseDetails(id: number): Promise<getCourseDetailsResponse> {
    const course = await this.courseRepository.findById(id);
    const classAndStudent =
      await this.classRepository.findWithStudentByCourseId(id);

    return getCourseDetailsResponse.mapToCourseDetailsResponse(
      course,
      classAndStudent,
    );
  }
}
