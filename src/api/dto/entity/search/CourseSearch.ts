import { RowDataPacket } from 'mysql2';

import { CourseCategory } from '@constant/CourseConstant';

export class CourseSearch {
  constructor(
    readonly id: number,
    readonly category: CourseCategory,
    readonly title: string,
    readonly instructorName: string,
    readonly price: number,
    readonly studentCount: number,
    readonly publishedOn: Date,
  ) {}

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
