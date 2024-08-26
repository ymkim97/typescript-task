import { Expose } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export default class OpenCourseRequest {
  @Expose()
  @IsInt()
  @Min(1)
  instructorId: number; // 사용자의 JWT 또는 Session 정보를 대신
}
