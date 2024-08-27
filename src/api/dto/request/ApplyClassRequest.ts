import { Expose } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsInt,
  Min,
} from 'class-validator';

export default class ApplyClassRequest {
  @Expose()
  @IsInt()
  @Min(1)
  studentId: number;

  @Expose()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(1, { each: true })
  courseIds: number[];
}
