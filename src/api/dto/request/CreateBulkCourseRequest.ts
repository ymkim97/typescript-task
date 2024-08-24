import { Expose, Type } from 'class-transformer';

import { IsNotEmptyObject, ValidateNested } from 'class-validator';
import CreateCourseRequest from './CreateCourseRequest';

export default class CreateBulkCourseRequest {
  @Expose({ name: 'courses' })
  @ValidateNested({ each: true })
  @Type(() => CreateCourseRequest)
  @IsNotEmptyObject()
  createCourseRequest: CreateCourseRequest[];
}
