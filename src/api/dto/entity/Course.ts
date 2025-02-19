import { RowDataPacket } from 'mysql2';

import { CourseCategory } from '@constant/CourseConstant';
import UpdateCourseRequest from '@dto/request/UpdateCourseRequest';

export class Course {
  constructor(
    private _instructorId: number,
    private _title: string,
    private description: string,
    private price: number,
    private category: CourseCategory,
    private _studentCount: number,
    private createDate?: Date,
    private updateDate?: Date,
    private _id?: number,
    private _isPublic?: boolean,
  ) {}

  public get itemsForCourseDetailsResponse() {
    return {
      title: this._title,
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
      title: this._title,
      description: this.description,
      price: this.price,
      category: this.category,
    };
  }

  public get itemsForUpdate() {
    return {
      title: this._title,
      description: this.description,
      price: this.price,
      id: this._id,
    };
  }

  public get instructorId() {
    return this._instructorId;
  }

  public get isPublic() {
    return this._isPublic;
  }

  public get id() {
    return this._id;
  }

  public get title() {
    return this._title;
  }

  public get studentCount() {
    return this._studentCount;
  }

  public set update(request: UpdateCourseRequest) {
    this._title = request.title;
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
      courseMysql.student_count,
      courseMysql.create_date,
      courseMysql.update_date,
      courseMysql.id,
      courseMysql.is_public,
    );
  }
}

export interface CourseMysql extends RowDataPacket {
  id: number;
  instructor_id: number;
  is_public: boolean;
  title: string;
  description: string;
  price: number;
  category: CourseCategory;
  student_count: number;
  create_date: Date;
  update_date: Date;
}
