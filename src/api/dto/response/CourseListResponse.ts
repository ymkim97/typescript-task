import { CourseSearch } from '@dto/entity/search/CourseSearch';

export class CourseListResponse {
  constructor(readonly courses: CourseSearch[]) {}

  public static from(courses: CourseSearch[]): CourseListResponse {
    return new CourseListResponse(courses);
  }
}
