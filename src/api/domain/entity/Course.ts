import { changeDateToString } from '@util/dateFormatter';
import { CATEGORY_VALUES } from '@constant/CourseConstant';

export class Course {
  private id: number;
  private instructorId: number;
  private isPublic: boolean;
  private title: string;
  private description: string;
  private price: number;
  private category: (typeof CATEGORY_VALUES)[keyof typeof CATEGORY_VALUES];
  private publishedOn: string;
  private updatedOn: string;

  constructor(
    id: number,
    instructorId: number,
    isPublic: boolean,
    title: string,
    description: string,
    price: number,
    category: (typeof CATEGORY_VALUES)[keyof typeof CATEGORY_VALUES],
    publishedOn: Date,
    updatedOn: Date,
  ) {
    this.id = id;
    this.instructorId = instructorId;
    this.isPublic = isPublic;
    this.title = title;
    this.description = description;
    this.price = price;
    this.category = category;
    this.publishedOn = changeDateToString(publishedOn);
    this.updatedOn = changeDateToString(updatedOn);
  }

  public static from(courseMysql: CourseMysql): Course {
    return new Course(
      courseMysql.id,
      courseMysql.instructor_id,
      courseMysql.is_public,
      courseMysql.title,
      courseMysql.description,
      courseMysql.price,
      courseMysql.category,
      courseMysql.create_date,
      courseMysql.update_date,
    );
  }

  public get itemsForCourseDetailsResponse() {
    return {
      title: this.title,
      description: this.description,
      category: this.category,
      price: this.price,
      publishedOn: this.publishedOn,
      updatedOn: this.updatedOn,
    };
  }
}

export interface CourseMysql {
  id: number;
  instructor_id: number;
  is_public: boolean;
  title: string;
  description: string;
  price: number;
  category: (typeof CATEGORY_VALUES)[keyof typeof CATEGORY_VALUES];
  create_date: Date;
  update_date: Date;
}
