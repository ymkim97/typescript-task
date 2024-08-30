import { Expose } from 'class-transformer';
import { IsEmail, Length } from 'class-validator';

import { ERROR_MESSAGE } from '@constant/ErrorMessageConstant';
import { Student } from '@entity/Student';

export default class SignUpStudentRequest {
  @Expose()
  @IsEmail({}, { message: ERROR_MESSAGE.EMAIL_FORMAT })
  @Length(1, 50)
  email: string;

  @Expose()
  @Length(1, 30, { message: ERROR_MESSAGE.STUDENT_NICKNAME_LENGTH })
  nickname: string;

  public toEntity(): Student {
    return new Student(this.email, this.nickname);
  }
}
