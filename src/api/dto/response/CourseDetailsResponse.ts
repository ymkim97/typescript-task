import { CourseCategory } from '@constant/CourseConstant';
import { Course } from '@entity/Course';
import { StudentClass } from '@entity/StudentClass';

export default class CourseDetailsResponse {
  constructor(
    readonly title: string,
    readonly description: string,
    readonly category: CourseCategory,
    readonly price: number,
    readonly studentCount: number,
    readonly students: StudentClass[],
    readonly publishedOn?: Date,
    readonly updatedOn?: Date,
  ) {}

  public static from(
    course: Course,
    studentClasses: StudentClass[],
  ): CourseDetailsResponse {
    const courseItems = course.itemsForCourseDetailsResponse;

    return new CourseDetailsResponse(
      courseItems.title,
      courseItems.description,
      courseItems.category,
      courseItems.price,
      course.studentCount,
      studentClasses,
      courseItems.createDate,
      courseItems.updateDate,
    );
  }
}
