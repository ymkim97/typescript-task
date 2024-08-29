import { singleton } from 'tsyringe';

import CourseDetailsResponse from '@dto/response/CourseDetailsResponse';
import { CourseListResponse } from '@dto/response/CourseListResponse';
import ClassRepository from '@repository/ClassRepository';
import CourseRepository from '@repository/CourseRepository';

@singleton()
export default class SearchService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly classRepository: ClassRepository,
  ) {}

  public async getCourseDetails(
    id: number,
  ): Promise<CourseDetailsResponse | void> {
    const course = await this.courseRepository.findById(id);

    if (!course) return;

    const classAndStudents =
      await this.classRepository.findAllWithStudentsByCourseId(id);

    return CourseDetailsResponse.from(course, classAndStudents);
  }

  public async searchCourseByKeyword(
    type: string,
    keyword: string,
    category: string,
    pageNumber: number,
    pageSize: number,
    sort: string,
  ): Promise<CourseListResponse | void> {
    const startIndex = (pageNumber - 1) * pageSize;
    const searchResults = await this.courseRepository.findAllByKeyword(
      type,
      keyword,
      category,
      startIndex,
      pageSize,
      sort,
    );

    if (!searchResults) return;

    return CourseListResponse.from(searchResults);
  }
}
