import { IsInt, IsString, Min } from 'class-validator';

import { CourseCategory } from '@constant/CourseConstant';
import { IsValidCourseCategory } from '@decorator/IsValidCourseCategory';
import { Expose } from 'class-transformer';

export class CreateCourseRequest {
  @Expose()
  @IsInt()
  @Min(0)
  instructorId: number;

  @Expose()
  @IsString()
  title: string;

  @Expose()
  @IsString()
  description: string;

  @Expose()
  @IsInt()
  @Min(0)
  price: number;

  @Expose()
  @IsString()
  @IsValidCourseCategory()
  category: CourseCategory;
}
