import { RowDataPacket } from 'mysql2';

export class CourseClass {
  readonly courseId: number;
  readonly isPublic: boolean;
  readonly studentId: number;

  constructor(courseId: number, isPublic: boolean, studentId: number) {
    this.courseId = courseId;
    this.isPublic = isPublic;
    this.studentId = studentId;
  }

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
