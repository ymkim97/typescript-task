import { Course } from '@type/CourseType';
import { StudentAndClass } from '@type/StudentClassType';

export interface getCourseDetailsResponse {
  title: string;
  description: string;
  category: CATEGORY_VALUES;
  price: number;
  studentCount: number;
  publishedOn: Date;
  updatedOn: Date;
  student: StudentAndClass[];
}

export function mapToCourseDetailsResponse(
  course: Course,
  studentAndClass: StudentAndClass[],
): getCourseDetailsResponse {
  return {
    title: course.title,
    description: course.description,
    category: course.category,
    price: course.price,
    studentCount: studentAndClass.length,
    publishedOn: course.publishedOn,
    updatedOn: course.updatedOn,
    student: studentAndClass,
  };
}

export enum CATEGORY_VALUES {
  '웹',
  '앱',
  '게임',
  '알고리즘',
  '인프라',
  '데이터베이스',
}
