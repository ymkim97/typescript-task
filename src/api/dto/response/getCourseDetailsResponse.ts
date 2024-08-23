import { CATEGORY_VALUES } from '@constant/CourseConstant';
import { StudentClass } from '@entity/StudentClass';
import { Course } from '@entity/Course';

export class getCourseDetailsResponse {
  title: string;
  description: string;
  category: (typeof CATEGORY_VALUES)[keyof typeof CATEGORY_VALUES];
  price: number;
  studentCount: number;
  publishedOn: string;
  updatedOn: string;
  students: StudentClass[];

  constructor(
    title: string,
    description: string,
    category: (typeof CATEGORY_VALUES)[keyof typeof CATEGORY_VALUES],
    price: number,
    studentCount: number,
    publishedOn: string,
    updatedOn: string,
    students: StudentClass[],
  ) {
    this.title = title;
    this.description = description;
    this.category = category;
    this.price = price;
    this.studentCount = studentCount;
    this.publishedOn = publishedOn;
    this.updatedOn = updatedOn;
    this.students = students;
  }

  public static mapToCourseDetailsResponse(
    course: Course,
    studentClass: StudentClass[],
  ): getCourseDetailsResponse {
    const courseItems = course.itemsForCourseDetailsResponse;

    return new getCourseDetailsResponse(
      courseItems.title,
      courseItems.description,
      courseItems.category,
      courseItems.price,
      studentClass.length,
      courseItems.publishedOn,
      courseItems.updatedOn,
      studentClass,
    );
  }
}
