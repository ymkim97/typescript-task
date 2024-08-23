import { changeDateToString } from '@util/dateFormatter';
import { CourseCategory } from '@constant/CourseConstant';

export class Course {
  private id: number;
  private instructorId: number;
  private isPublic: boolean;
  private title: string;
  private description: string;
  private price: number;
  private category: CourseCategory;
  private createDate: string;
  private updateDate: string;

  constructor(
    id: number,
    instructorId: number,
    isPublic: boolean,
    title: string,
    description: string,
    price: number,
    category: CourseCategory,
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
    this.createDate = changeDateToString(publishedOn);
    this.updateDate = changeDateToString(updatedOn);
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
      createDate: this.createDate,
      updateDate: this.updateDate,
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
  category: CourseCategory;
  create_date: Date;
  update_date: Date;
}
