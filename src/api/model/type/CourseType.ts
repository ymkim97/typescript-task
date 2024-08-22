export interface CourseMysql {
  id: number;
  instructor_id: number;
  is_public: boolean;
  title: string;
  description: string;
  price: number;
  category: CATEGORY_VALUES;
  create_date: Date;
  update_date: Date;
}

export interface Course {
  id: number;
  instructorId: number;
  isPublic: boolean;
  title: string;
  description: string;
  price: number;
  category: CATEGORY_VALUES;
  publishedOn: Date;
  updatedOn: Date;
}

enum CATEGORY_VALUES {
  '웹',
  '앱',
  '게임',
  '알고리즘',
  '인프라',
  '데이터베이스',
}

export function mapToCourse(course: CourseMysql): Course {
  return {
    id: course.id,
    instructorId: course.instructor_id,
    isPublic: course.is_public,
    title: course.title,
    description: course.description,
    price: course.price,
    category: course.category,
    publishedOn: course.create_date,
    updatedOn: course.update_date,
  };
}
