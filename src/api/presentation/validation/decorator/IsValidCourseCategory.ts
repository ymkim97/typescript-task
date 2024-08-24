import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

import { CATEGORY_VALUES } from '@constant/CourseConstant';
import { ERROR_MESSAGE } from '@constant/ErrorConstant';

@ValidatorConstraint({ async: true })
class IsValidCategoryConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    return Object.values(CATEGORY_VALUES).includes(value);
  }

  defaultMessage(args: ValidationArguments): string {
    return ERROR_MESSAGE.INVALID_COURSE_CATEGORY;
  }
}

export function IsValidCourseCategory(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidCategory',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidCategoryConstraint,
    });
  };
}
