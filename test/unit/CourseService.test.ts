import {
  anyOfClass,
  anything,
  instance,
  mock,
  when,
} from '@johanblumenberg/ts-mockito';

import { DUPLICATE_ENTRY } from '@constant/MysqlErrors';
import { STATUS_CODE } from '@constant/StatusConstant';
import CreateBulkCourseRequest from '@dto/request/CreateBulkCourseRequest';
import CreateCourseRequest from '@dto/request/CreateCourseRequest';
import { Course } from '@entity/Course';
import { CourseClass } from '@entity/search/CourseClass';
import RequestError from '@error/RequestError';
import SqlError from '@error/SqlError';
import CourseRepository from '@repository/CourseRepository';
import CourseService from '@service/CourseService';
import InstructorService from '@service/InstructorService';

const stubCourseRepository = mock(CourseRepository);
const stubInstructorService = mock(InstructorService);
const courseService = new CourseService(
  instance(stubCourseRepository),
  instance(stubInstructorService),
);

describe('강의 등록', () => {
  it('중복된 강의명이면 RequestError 발생', async () => {
    // given
    const createCourseRequest = new CreateCourseRequest();
    createCourseRequest.instructorId = 1;
    createCourseRequest.title = 'InfLab Test Code';
    createCourseRequest.description = '안정적인 테스트 코드 짜기';
    createCourseRequest.price = 9000;
    createCourseRequest.category = '웹';

    const sqlError = new SqlError('TEST', STATUS_CODE.INTERNAL_SERVER_ERROR);
    sqlError.originalError = { errno: DUPLICATE_ENTRY } as any;

    when(stubInstructorService.isExist(1)).thenResolve(true);
    when(stubCourseRepository.save(anyOfClass(Course))).thenReject(sqlError);

    // when & then
    await expect(
      courseService.registerNew(createCourseRequest),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it('중복된 강의명이 아닌 다른 예외 발생 시 SqlError 발생', async () => {
    // given
    const createCourseRequest = new CreateCourseRequest();
    createCourseRequest.instructorId = 1;
    createCourseRequest.title = 'InfLab Test Code';
    createCourseRequest.description = '안정적인 테스트 코드 짜기';
    createCourseRequest.price = 9000;
    createCourseRequest.category = '웹';

    const sqlError = new SqlError('TEST', STATUS_CODE.INTERNAL_SERVER_ERROR);

    when(stubInstructorService.isExist(1)).thenResolve(true);
    when(stubCourseRepository.save(anyOfClass(Course))).thenReject(sqlError);

    // when
    await expect(
      courseService.registerNew(createCourseRequest),
    ).rejects.toBeInstanceOf(SqlError);
  });
});

describe('강의 대량 등록', () => {
  it('요청 내에서 중복된 강의가 있을때 RequestError 발생', async () => {
    // given
    const createCourseRequest1 = new CreateCourseRequest();
    createCourseRequest1.instructorId = 1;
    createCourseRequest1.title = 'InfLab Test Code';
    createCourseRequest1.description = '새로운 코드';
    createCourseRequest1.price = 2000;
    createCourseRequest1.category = '데이터베이스';

    const createCourseRequest2 = new CreateCourseRequest();
    createCourseRequest2.instructorId = 1;
    createCourseRequest2.title = 'InfLab Test Code';
    createCourseRequest2.description = '안정적인 테스트 코드 짜기';
    createCourseRequest2.price = 9000;
    createCourseRequest2.category = '웹';

    const createBulkCourseRequest = new CreateBulkCourseRequest();
    createBulkCourseRequest.createCourseRequest = [
      createCourseRequest1,
      createCourseRequest2,
    ];

    when(stubInstructorService.isExist(1)).thenResolve(true);

    // when & then
    await expect(
      courseService.registerNewBulk(createBulkCourseRequest),
    ).rejects.toBeInstanceOf(RequestError);
  });

  it('기존에 중복된 강의가 있을때 해당 강의 이름과 RequestError 발생', async () => {
    // given
    const title1 = '새로운 Test Code';
    const title2 = 'InfLab Test Code';

    const createCourseRequest1 = new CreateCourseRequest();
    createCourseRequest1.instructorId = 1;
    createCourseRequest1.title = title1;
    createCourseRequest1.description = '새로운 코드';
    createCourseRequest1.price = 2000;
    createCourseRequest1.category = '데이터베이스';

    const createCourseRequest2 = new CreateCourseRequest();
    createCourseRequest2.instructorId = 1;
    createCourseRequest2.title = title2;
    createCourseRequest2.description = '안정적인 테스트 코드 짜기';
    createCourseRequest2.price = 9000;
    createCourseRequest2.category = '웹';

    const createBulkCourseRequest = new CreateBulkCourseRequest();
    createBulkCourseRequest.createCourseRequest = [
      createCourseRequest1,
      createCourseRequest2,
    ];

    const course1 = new Course(2, title1, 'desc', 3400, '게임', 0);
    const course2 = new Course(2, title2, 'desc', 6700, '앱', 0);

    when(stubInstructorService.isExist(1)).thenResolve(true);
    when(stubCourseRepository.findAllByTitles(anything())).thenResolve([
      course1,
      course2,
    ]);

    // when & then
    try {
      await courseService.registerNewBulk(createBulkCourseRequest);
    } catch (error) {
      expect(error).toBeInstanceOf(RequestError);
      const e = error as RequestError;
      expect(e.validationMessages).toContain(title1);
      expect(e.validationMessages).toContain(title2);
    }
  });
});

describe('강의 등록 가능 여부 확인', () => {
  it('강의의 상황에 따라 CourseAvailability 반환', async () => {
    // given
    const studentId = 1;
    const availableId = 5;
    const alreadyAppliedId1 = 6;
    const alreadyAppliedId2 = 7;
    const noExistId = 8;
    const noPublicId1 = 9;
    const noPublicId2 = 10;
    const requestCourseIds = [5, 6, 7, 8, 9, 10];

    const courseClass1 = new CourseClass(5, true, undefined);
    const courseClass2 = new CourseClass(6, true, 1);
    const courseClass3 = new CourseClass(7, true, 1);
    const courseClass4 = new CourseClass(9, false, undefined);
    const courseClass5 = new CourseClass(10, false, undefined);

    const courseClasses = [
      courseClass1,
      courseClass2,
      courseClass3,
      courseClass4,
      courseClass5,
    ];

    when(
      stubCourseRepository.findAllWithClassByStudentIdAndCourseIds(
        studentId,
        requestCourseIds,
      ),
    ).thenResolve(courseClasses);

    // when
    const actual = await courseService.getCourseAvailability(
      studentId,
      requestCourseIds,
    );

    // then
    expect(actual.available).toEqual([availableId]);
    expect(actual.alreadyApplied).toEqual([
      alreadyAppliedId1,
      alreadyAppliedId2,
    ]);
    expect(actual.noExist).toEqual([noExistId]);
    expect(actual.noPublic).toEqual([noPublicId1, noPublicId2]);
  });
});
