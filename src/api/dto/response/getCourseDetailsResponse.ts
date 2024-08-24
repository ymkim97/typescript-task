import { CourseCategory } from '@constant/CourseConstant';
import { Course } from '@entity/Course';
import { StudentClass } from '@entity/StudentClass';

export class GetCourseDetailsResponse {
  title: string;
  description: string;
  category: CourseCategory;
  price: number;
  studentCount: number;
  publishedOn: string;
  updatedOn: string;
  students: StudentClass[];

  constructor(
    title: string,
    description: string,
    category: CourseCategory,
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
    studentClasses: StudentClass[],
  ): GetCourseDetailsResponse {
    const courseItems = course.itemsForCourseDetailsResponse;

    return new GetCourseDetailsResponse(
      courseItems.title,
      courseItems.description,
      courseItems.category,
      courseItems.price,
      studentClasses.length,
      courseItems.createDate,
      courseItems.updateDate,
      studentClasses,
    );
  }
}
