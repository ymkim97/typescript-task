import { Expose, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';

import { ERROR_MESSAGE } from '@constant/ErrorConstant';
import CreateCourseRequest from './CreateCourseRequest';

export default class CreateBulkCourseRequest {
  @Expose({ name: 'courses' })
  @ValidateNested({ each: true })
  @Type(() => CreateCourseRequest)
  @IsNotEmptyObject()
  @ArrayMaxSize(10, { message: ERROR_MESSAGE.COURSE_BULK_TOO_MUCH })
  createCourseRequest: CreateCourseRequest[];
}
