import { Expose } from 'class-transformer';
import { IsInt, Length, Min } from 'class-validator';

export default class UpdateCourseRequest {
  @Expose()
  @IsInt()
  @Min(1)
  instructorId: number; // 사용자의 JWT 또는 Session 정보를 대신

  @Expose()
  @Length(0, 50)
  title: string;

  @Expose()
  @Length(0, 65535)
  description: string;

  @Expose()
  @IsInt()
  @Min(0)
  price: number;
}
