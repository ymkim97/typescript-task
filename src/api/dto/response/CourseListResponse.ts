import { CourseSearch } from '@entity/CourseSearch';

export class CourseListResponse {
  courses: CourseSearch[];

  constructor(courses: CourseSearch[]) {
    this.courses = courses;
  }

  public static from(courses: CourseSearch[]): CourseListResponse {
    return new CourseListResponse(courses);
  }
}
