import { IsInt, IsString, Length, Min } from 'class-validator';

import { CourseCategory } from '@constant/CourseConstant';
import { IsValidCourseCategory } from '@decorator/IsValidCourseCategory';
import { Course } from '@entity/Course';
import { Expose } from 'class-transformer';

export class CreateCourseRequest {
  @Expose()
  @IsInt()
  @Min(0)
  instructorId: number;

  @Expose()
  @IsString()
  @Length(0, 50)
  title: string;

  @Expose()
  @IsString()
  @Length(0, 65535)
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
    // Input 확인하기
    const createDate = new Date();
    return new Course(
      this.instructorId,
      this.title,
      this.description,
      this.price,
      this.category,
      createDate,
      createDate,
    );
  }
}
