import { CourseCategory } from '@constant/CourseConstant';
import { RowDataPacket } from 'mysql2';

export class CourseSearch {
  readonly id: number;
  readonly category: CourseCategory;
  readonly title: string;
  readonly instructorName: string;
  readonly price: number;
  readonly studentCount: number;
  readonly publishedOn: Date;

  constructor(
    id: number,
    category: CourseCategory,
    title: string,
    instructorName: string,
    price: number,
    studentCount: number,
    publishedOn: Date,
  ) {
    this.id = id;
    this.category = category;
    this.title = title;
    this.instructorName = instructorName;
    this.price = price;
    this.studentCount = studentCount;
    this.publishedOn = publishedOn;
  }

  public static from(courseSearchMysql: CourseSearchMysql) {
    return new CourseSearch(
      courseSearchMysql.course_id,
      courseSearchMysql.category,
      courseSearchMysql.title,
      courseSearchMysql.instructor_name,
      courseSearchMysql.price,
      courseSearchMysql.student_count,
      courseSearchMysql.create_date,
    );
  }
}

export interface CourseSearchMysql extends RowDataPacket {
  course_id: number;
  category: CourseCategory;
  title: string;
  instructor_name: string;
  price: number;
  student_count: number;
  create_date: Date;
}
