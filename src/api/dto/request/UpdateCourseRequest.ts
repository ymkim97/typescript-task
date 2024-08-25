import { Expose } from 'class-transformer';
import { IsInt, IsString, Length, Min } from 'class-validator';

export default class UpdateCourseRequest {
  @Expose()
  @IsInt()
  @Min(0)
  instructorId: number; // 사용자의 JWT 또는 Session 정보를 대신

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
}
