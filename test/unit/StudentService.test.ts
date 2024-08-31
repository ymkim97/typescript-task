import {
  anyOfClass,
  instance,
  mock,
  resetCalls,
  verify,
  when,
} from '@johanblumenberg/ts-mockito';
import { PoolConnection } from 'mysql2/promise';

import { ERROR_MESSAGE } from '@constant/ErrorMessageConstant';
import { DUPLICATE_ENTRY } from '@constant/MysqlErrors';
import { STATUS_CODE } from '@constant/StatusConstant';
import ApplyClassRequest from '@dto/request/ApplyClassRequest';
import SignUpStudentRequest from '@dto/request/SignUpStudentRequest';
import ApplyClassResponse from '@dto/response/ApplyClassResponse';
import CourseAvailability from '@dto/type/CourseAvailability';
import { Student } from '@entity/Student';
import RequestError from '@error/RequestError';
import SqlError from '@error/SqlError';
import Mysql from '@loader/Mysql';
import ClassRepository from '@repository/ClassRepository';
import CourseRepository from '@repository/CourseRepository';
import StudentRepository from '@repository/StudentRepository';
import CourseService from '@service/CourseService';
import StudentService from '@service/StudentService';
import { executeQueryTransaction } from '@util/mysqlUtil';

const stubCourseService = mock(CourseService);
const stubStudentRepository = mock(StudentRepository);
const stubClassRepository = mock(ClassRepository);
const stubCourseRepository = mock(CourseRepository);
const stubMysqlPool = mock(Mysql);

const studentService = new StudentService(
  instance(stubCourseService),
  instance(stubStudentRepository),
  instance(stubClassRepository),
  instance(stubCourseRepository),
  instance(stubMysqlPool),
);

jest.mock('@util/mysqlUtil', () => ({
  executeQueryTransaction: jest.fn(),
}));
const executeQueryTransactionMock = jest.mocked(executeQueryTransaction);
executeQueryTransactionMock.mockImplementation(async (connection, fn) => {
  return await fn();
});

const connectionMock = {
  release: jest.fn(),
  beginTransaction: jest.fn(),
  commit: jest.fn(),
} as unknown as PoolConnection;

afterEach(() => {
  resetCalls(stubCourseService);
  resetCalls(stubStudentRepository);
  resetCalls(stubClassRepository);
  resetCalls(stubCourseRepository);
  resetCalls(stubMysqlPool);
});

describe('회원 가입', () => {
  it('중복된 이메일이면 RequestError 발생', async () => {
    // given
    const signUpRequest = new SignUpStudentRequest();
    signUpRequest.email = 'abc@gmail.com';
    signUpRequest.nickname = 'NicknameABC';

    const sqlError = new SqlError('TEST', STATUS_CODE.INTERNAL_SERVER_ERROR);
    sqlError.originalError = { errno: DUPLICATE_ENTRY } as any;

    when(stubStudentRepository.save(anyOfClass(Student))).thenReject(sqlError);

    // when
    const actual = async () => {
      await studentService.signUp(signUpRequest);
    };

    // then
    expect(actual).rejects.toThrow(
      new RequestError(ERROR_MESSAGE.DUPLICATE_EMAIL, STATUS_CODE.BAD_REQUEST),
    );
  });

  it('중복된 이메일이 아닌 다른 예외 발생 시 SqlError 발생', async () => {
    // given
    const signUpRequest = new SignUpStudentRequest();
    signUpRequest.email = 'abc@gmail.com';
    signUpRequest.nickname = 'NicknameABC';

    const sqlError = new SqlError('TEST', STATUS_CODE.INTERNAL_SERVER_ERROR);

    when(stubStudentRepository.save(anyOfClass(Student))).thenReject(sqlError);

    // when
    const actual = async () => {
      await studentService.signUp(signUpRequest);
    };

    // then
    expect(actual).rejects.toThrow(
      new SqlError(ERROR_MESSAGE.SQL_ERROR, STATUS_CODE.INTERNAL_SERVER_ERROR),
    );
  });
});

describe('회원 탈퇴', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('수강중인 강의가 있으면 학생 수 수정', async () => {
    // given
    const student = new Student('abc@gmail.com', '닉네임', 1);
    const courseIds = [1, 2, 3];

    when(stubStudentRepository.findById(1)).thenResolve(student);
    when(stubClassRepository.findAllCourseIdsByStudentId(1)).thenResolve(
      courseIds,
    );
    when(
      stubClassRepository.deleteAllByStudentId(1, connectionMock),
    ).thenResolve();
    when(stubStudentRepository.delete(student, connectionMock)).thenResolve();
    when(
      stubCourseRepository.updateStudentCountByIds(
        courseIds,
        true,
        connectionMock,
      ),
    ).thenResolve;
    when(stubMysqlPool.getConnection()).thenResolve(connectionMock);

    // when
    const actual = await studentService.withdraw(1);

    // then
    expect(actual).toEqual(1);
    verify(
      stubCourseRepository.updateStudentCountByIds(
        courseIds,
        true,
        connectionMock,
      ),
    ).once();
  });

  it('수강중인 강의가 없으면 학생 수 수정을 호출하지 않음', async () => {
    // given
    const student = new Student('abc@gmail.com', '닉네임', 1);
    const courseIds = [];

    when(stubStudentRepository.findById(1)).thenResolve(student);
    when(stubClassRepository.findAllCourseIdsByStudentId(1)).thenResolve(
      courseIds,
    );
    when(
      stubClassRepository.deleteAllByStudentId(1, connectionMock),
    ).thenResolve();
    when(stubStudentRepository.delete(student, connectionMock)).thenResolve();
    when(
      stubCourseRepository.updateStudentCountByIds(
        courseIds,
        true,
        connectionMock,
      ),
    ).thenResolve;
    when(stubMysqlPool.getConnection()).thenResolve(connectionMock);

    // when
    const actual = await studentService.withdraw(1);

    // then
    expect(actual).toEqual(1);
    verify(
      stubCourseRepository.updateStudentCountByIds(
        courseIds,
        true,
        connectionMock,
      ),
    ).never();
  });
});

describe('수강 신청', () => {
  it('수강 신청 가능한 강의만 신청, 못한 강의 식별자 id는 분리', async () => {
    // given
    const studentId = 1;
    const courseIds = [1, 2, 3, 7, 8, 9];
    const courseAvailability: CourseAvailability = {
      available: [1, 2, 3],
      alreadyApplied: [7],
      noExist: [8],
      noPublic: [9],
    };

    const applyClassRequest = new ApplyClassRequest();
    applyClassRequest.studentId = studentId;
    applyClassRequest.courseIds = courseIds;

    when(stubStudentRepository.findById(1)).thenResolve(anyOfClass(Student));
    when(
      stubCourseService.getCourseAvailability(studentId, courseIds),
    ).thenResolve(courseAvailability);
    when(
      stubClassRepository.saveAllByStudentIdAndCourseIds(
        studentId,
        courseAvailability.available,
        connectionMock,
      ),
    ).thenResolve(courseAvailability.available);
    when(
      stubCourseRepository.updateStudentCountByIds(
        courseAvailability.available,
        false,
        connectionMock,
      ),
    ).thenResolve();

    // when
    const actual = await studentService.applyClass(applyClassRequest);

    // then
    expect(actual).toBeInstanceOf(ApplyClassResponse);
    expect(actual.createdClassIds).toHaveLength(3);
    expect(actual.appliedCourseIds).toHaveLength(3);
    expect(actual.alreadyAppliedCourseIds).toHaveLength(1);
    expect(actual.noExistCourseIds).toHaveLength(1);
    expect(actual.noPublicCourseIds).toHaveLength(1);
  });

  it('수강 신청 가능한 강의가 없으면 데이터베이스 접근 없음', async () => {
    // given
    const studentId = 1;
    const courseIds = [7, 8, 9];
    const courseAvailability: CourseAvailability = {
      available: [],
      alreadyApplied: [7],
      noExist: [8],
      noPublic: [9],
    };

    const applyClassRequest = new ApplyClassRequest();
    applyClassRequest.studentId = studentId;
    applyClassRequest.courseIds = courseIds;

    when(stubStudentRepository.findById(1)).thenResolve(anyOfClass(Student));
    when(
      stubCourseService.getCourseAvailability(studentId, courseIds),
    ).thenResolve(courseAvailability);
    when(
      stubClassRepository.saveAllByStudentIdAndCourseIds(
        studentId,
        courseAvailability.available,
        connectionMock,
      ),
    ).thenResolve([]);
    when(
      stubCourseRepository.updateStudentCountByIds(
        courseAvailability.available,
        false,
        connectionMock,
      ),
    ).thenResolve();

    // when
    const actual = await studentService.applyClass(applyClassRequest);

    // then
    expect(actual).toBeInstanceOf(ApplyClassResponse);
    expect(actual.createdClassIds).toHaveLength(0);
    expect(actual.appliedCourseIds).toHaveLength(0);
    verify(
      stubClassRepository.saveAllByStudentIdAndCourseIds(
        studentId,
        courseAvailability.available,
        connectionMock,
      ),
    ).never();
    verify(
      stubCourseRepository.updateStudentCountByIds(
        courseAvailability.available,
        false,
        connectionMock,
      ),
    ).never();
  });
});
