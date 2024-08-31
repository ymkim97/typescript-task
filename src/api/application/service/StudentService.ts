import { singleton } from 'tsyringe';

import { ERROR_MESSAGE } from '@constant/ErrorMessageConstant';
import { DUPLICATE_ENTRY } from '@constant/MysqlErrors';
import { STATUS_CODE } from '@constant/StatusConstant';
import ApplyClassRequest from '@dto/request/ApplyClassRequest';
import SignUpStudentRequest from '@dto/request/SignUpStudentRequest';
import ApplyClassResponse from '@dto/response/ApplyClassResponse';
import RequestError from '@error/RequestError';
import SqlError from '@error/SqlError';
import Mysql from '@loader/Mysql';
import ClassRepository from '@repository/ClassRepository';
import CourseRepository from '@repository/CourseRepository';
import StudentRepository from '@repository/StudentRepository';
import { executeQueryTransaction } from '@util/mysqlUtil';
import CourseService from './CourseService';

@singleton()
export default class StudentService {
  constructor(
    private readonly courseService: CourseService,
    private readonly studentRepository: StudentRepository,
    private readonly classRepository: ClassRepository,
    private readonly courseRepository: CourseRepository,
    private readonly mysqlPool: Mysql,
  ) {}

  public async signUp(signUpRequest: SignUpStudentRequest): Promise<number> {
    const student = signUpRequest.toEntity();

    return await this.studentRepository.save(student).catch((e: SqlError) => {
      const mysqlError = e.originalError as any;

      if (mysqlError && mysqlError.errno === DUPLICATE_ENTRY) {
        throw new RequestError(
          ERROR_MESSAGE.DUPLICATE_EMAIL,
          STATUS_CODE.BAD_REQUEST,
        );
      } else throw e;
    });
  }

  public async withdraw(studentId: number): Promise<number> {
    const student = await this.studentRepository.findById(studentId);

    if (!student) {
      throw new RequestError(
        ERROR_MESSAGE.STUDENT_NOT_FOUND,
        STATUS_CODE.BAD_REQUEST,
      );
    }

    const courseIds =
      await this.classRepository.findAllCourseIdsByStudentId(studentId);

    const connection = await this.mysqlPool.getConnection();

    return await executeQueryTransaction(connection, async () => {
      await this.classRepository.deleteAllByStudentId(studentId, connection);
      await this.studentRepository.delete(student, connection);

      if (courseIds.length > 0) {
        await this.courseRepository.updateStudentCountByIds(
          courseIds,
          true,
          connection,
        );
      }

      return studentId;
    });
  }

  public async applyClass(
    applyClassRequest: ApplyClassRequest,
  ): Promise<ApplyClassResponse> {
    const student = await this.studentRepository.findById(
      applyClassRequest.studentId,
    );

    if (!student) {
      throw new RequestError(
        ERROR_MESSAGE.STUDENT_NOT_FOUND,
        STATUS_CODE.BAD_REQUEST,
      );
    }

    const courseAvailability = await this.courseService.getCourseAvailability(
      applyClassRequest.studentId,
      applyClassRequest.courseIds,
    );

    if (courseAvailability.available.length === 0) {
      return ApplyClassResponse.from(courseAvailability, []);
    }

    const connection = await this.mysqlPool.getConnection();

    return executeQueryTransaction(connection, async () => {
      const createdClassIds =
        await this.classRepository.saveAllByStudentIdAndCourseIds(
          applyClassRequest.studentId,
          courseAvailability.available,
          connection,
        );

      await this.courseRepository.updateStudentCountByIds(
        courseAvailability.available,
        false,
        connection,
      );

      return ApplyClassResponse.from(courseAvailability, createdClassIds);
    });
  }
}
