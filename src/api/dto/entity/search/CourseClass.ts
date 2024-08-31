import { RowDataPacket } from 'mysql2';

export class CourseClass {
  constructor(
    readonly courseId: number,
    readonly isPublic: boolean,
    readonly studentId?: number,
  ) {}

  public static from(courseClassMysql: CourseClassMysql): CourseClass {
    return new CourseClass(
      courseClassMysql.course_id,
      courseClassMysql.is_public,
      courseClassMysql.student_id,
    );
  }
}

export interface CourseClassMysql extends RowDataPacket {
  course_id: number;
  is_public: boolean;
  student_id: number;
}
