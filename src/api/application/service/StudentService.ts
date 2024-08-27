import { singleton } from 'tsyringe';

import { ERROR_MESSAGE } from '@constant/ErrorMessageConstant';
import { DUPLICATE_ENTRY } from '@constant/MysqlErrors';
import { STATUS_CODE } from '@constant/StatusConstant';
import SignUpStudentRequest from '@dto/request/SignUpStudentRequest';
import RequestError from '@error/RequestError';
import SqlError from '@error/SqlError';
import Mysql from '@loader/Mysql';
import ClassRepository from '@repository/ClassRepository';
import StudentRepository from '@repository/StudentRepository';
import { executeQueryTransaction } from '@util/mysqlUtil';

@singleton()
export default class StudentService {
  private studentRepository: StudentRepository;
  private classRepository: ClassRepository;
  private mysqlPool: Mysql;

  constructor(
    studentRepository: StudentRepository,
    classRepository: ClassRepository,
    mysqlPool: Mysql,
  ) {
    this.studentRepository = studentRepository;
    this.classRepository = classRepository;
    this.mysqlPool = mysqlPool;
  }

  public async signUp(signUpRequest: SignUpStudentRequest): Promise<number> {
    const student = signUpRequest.toEntity();

    return await this.studentRepository.save(student).catch((e: SqlError) => {
      const mysqlError = e.originalError as any;

      if (mysqlError.errno === DUPLICATE_ENTRY) {
        throw new RequestError(
          ERROR_MESSAGE.DUPLICATE_EMAIL,
          STATUS_CODE.BAD_REQUEST,
        );
      } else throw e;
    });
  }

  public async withdraw(studentId: number): Promise<number> {
    const connection = await this.mysqlPool.getConnection();
    const student = await this.studentRepository.findById(
      studentId,
      connection,
    );

    if (!student) {
      throw new RequestError(
        ERROR_MESSAGE.STUDENT_NOT_FOUND,
        STATUS_CODE.BAD_REQUEST,
      );
    }

    return await executeQueryTransaction(connection, async () => {
      await this.classRepository.deleteAllByStudentId(studentId, connection);
      await this.studentRepository.delete(student, connection);

      return studentId;
    });
  }

  // public async applyClass(
  //   applyClassRequest: ApplyClassRequest,
  // ): Promise<number[]> {

  // }
}
