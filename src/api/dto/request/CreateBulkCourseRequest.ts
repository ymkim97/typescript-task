import { Expose, Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, ValidateNested } from 'class-validator';

import { ERROR_MESSAGE } from '@constant/ErrorMessageConstant';
import CreateCourseRequest from './CreateCourseRequest';

export default class CreateBulkCourseRequest {
  @Expose({ name: 'courses' })
  @ValidateNested({ each: true })
  @Type(() => CreateCourseRequest)
  @ArrayMaxSize(10, { message: ERROR_MESSAGE.COURSE_BULK_TOO_MUCH })
  @ArrayMinSize(1, { message: ERROR_MESSAGE.COURSE_BULK_EMPTY })
  createCourseRequest: CreateCourseRequest[];
}
