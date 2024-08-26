import { CourseCategory } from '@constant/CourseConstant';
import { Course } from '@entity/Course';
import { StudentClass } from '@entity/StudentClass';

export default class CourseDetailsResponse {
  title: string;
  description: string;
  category: CourseCategory;
  price: number;
  studentCount: number;
  publishedOn?: Date;
  updatedOn?: Date;
  students: StudentClass[];

  constructor(
    title: string,
    description: string,
    category: CourseCategory,
    price: number,
    studentCount: number,
    students: StudentClass[],
    publishedOn?: Date,
    updatedOn?: Date,
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
      studentClasses.length,
      studentClasses,
      courseItems.createDate,
      courseItems.updateDate,
    );
  }
}
