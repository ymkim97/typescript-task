import { CourseSearch } from '@entity/CourseSearch';

export class CourseListResponse {
  constructor(readonly courses: CourseSearch[]) {}

  public static from(courses: CourseSearch[]): CourseListResponse {
    return new CourseListResponse(courses);
  }
}
