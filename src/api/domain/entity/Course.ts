import { CourseCategory } from '@constant/CourseConstant';
import UpdateCourseRequest from '@dto/request/UpdateCourseRequest';

export class Course {
  private id?: number;
  private _instructorId: number;
  private isPublic?: boolean;
  private title: string;
  private description: string;
  private price: number;
  private category: CourseCategory;
  private createDate?: Date;
  private updateDate?: Date;

  constructor(
    instructorId: number,
    title: string,
    description: string,
    price: number,
    category: CourseCategory,
    createDate?: Date,
    updateDate?: Date,
    id?: number,
    isPublic?: boolean,
  ) {
    this.id = id;
    this._instructorId = instructorId;
    this.isPublic = isPublic;
    this.title = title;
    this.description = description;
    this.price = price;
    this.category = category;
    this.createDate = createDate;
    this.updateDate = updateDate;
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

  public get itemsForSave() {
    return {
      instructorId: this._instructorId,
      title: this.title,
      description: this.description,
      price: this.price,
      category: this.category,
    };
  }

  public get itemsForUpdate() {
    return {
      title: this.title,
      description: this.description,
      price: this.price,
      id: this.id,
    };
  }

  public get instructorId() {
    return this._instructorId;
  }

  public set update(request: UpdateCourseRequest) {
    this.title = request.title;
    this.description = request.description;
    this.price = request.price;
  }

  public static from(courseMysql: CourseMysql): Course {
    return new Course(
      courseMysql.instructor_id,
      courseMysql.title,
      courseMysql.description,
      courseMysql.price,
      courseMysql.category,
      courseMysql.create_date,
      courseMysql.update_date,
      courseMysql.id,
      courseMysql.is_public,
    );
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
