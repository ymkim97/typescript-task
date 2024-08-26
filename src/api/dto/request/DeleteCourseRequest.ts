import { Expose } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export default class DeleteCourseRequest {
  @Expose()
  @IsInt()
  @Min(0)
  instructorId: number;
}
