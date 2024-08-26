import { singleton } from 'tsyringe';

import { ERROR_MESSAGE } from '@constant/ErrorMessageConstant';
import { DUPLICATE_ENTRY } from '@constant/MysqlErrors';
import { STATUS_CODE } from '@constant/StatusConstant';
import SignUpStudentRequest from '@dto/request/SignUpStudentRequest';
import RequestError from '@error/RequestError';
import SqlError from '@error/SqlError';
import StudentRepository from '@repository/StudentRepository';

@singleton()
export default class StudentService {
  private studentRepository: StudentRepository;

  constructor(studentRepository: StudentRepository) {
    this.studentRepository = studentRepository;
  }

  public async signUp(signUpRequest: SignUpStudentRequest): Promise<number> {
    const student = signUpRequest.toEntity();

    return await this.studentRepository.save(student).catch((e: SqlError) => {
      const mysqlError = e.originalError as any;

      console.log(mysqlError);

      if (mysqlError.errno === DUPLICATE_ENTRY) {
        throw new RequestError(
          ERROR_MESSAGE.DUPLICATE_EMAIL,
          STATUS_CODE.BAD_REQUEST,
        );
      } else throw e;
    });
  }
}
