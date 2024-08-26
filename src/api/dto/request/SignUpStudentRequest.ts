import { Expose } from 'class-transformer';
import { IsEmail, Length } from 'class-validator';

import { Student } from '@entity/Student';

export default class SignUpStudentRequest {
  @Expose()
  @IsEmail()
  @Length(1, 50)
  email: string;

  @Expose()
  @Length(1, 30)
  nickname: string;

  public toEntity(): Student {
    return new Student(this.email, this.nickname);
  }
}
