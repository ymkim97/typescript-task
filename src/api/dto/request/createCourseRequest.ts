import { Expose } from 'class-transformer';
import { IsInt, IsString, Length, Min } from 'class-validator';

import { CourseCategory } from '@constant/CourseConstant';
import { IsValidCourseCategory } from '@decorator/IsValidCourseCategory';
import { Course } from '@entity/Course';

export default class CreateCourseRequest {
  @Expose()
  @IsInt()
  @Min(1)
  instructorId: number;

  @Expose()
  @Length(0, 50)
  title: string;

  @Expose()
  @Length(1, 65535)
  description: string;

  @Expose()
  @IsInt()
  @Min(0)
  price: number;

  @Expose()
  @IsString()
  @IsValidCourseCategory()
  category: CourseCategory;

  public toEntity(): Course {
    return new Course(
      this.instructorId,
      this.title,
      this.description,
      this.price,
      this.category,
    );
  }
}
