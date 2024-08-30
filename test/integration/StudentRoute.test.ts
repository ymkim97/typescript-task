import { ResultSetHeader, RowDataPacket } from 'mysql2';
import request from 'supertest';

import { ERROR_MESSAGE } from '@constant/ErrorMessageConstant';
import { STATUS_CODE } from '@constant/StatusConstant';
import ApplyClassRequest from '@dto/request/ApplyClassRequest';
import { app, mysql } from '@test/setup-test';
import { truncateClass, truncateCourse, truncateStudent } from '@test/testUtil';

describe('수강생 회원 가입', () => {
  afterEach(truncateStudent);

  it('수강생 회원 가입 성공 - 식별 id 반환', async () => {
    // given
    const studentRequest = { email: 'abc@gmail.com', nickname: 'NicknameABC' };

    // when
    const response = await request(app).post('/students').send(studentRequest);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.CREATED);
    expect(response.body).toHaveProperty('signUpId');
  });

  it('수강생 회원가입 실패 - 중복된 email', async () => {
    // given
    const student1 = { email: 'abc@gmail.com', nickname: 'NicknameABC' };
    await request(app).post('/students').send(student1);

    const studentRequest = { email: 'abc@gmail.com', nickname: 'TestNick' };

    // when
    const response = await request(app).post('/students').send(studentRequest);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.BAD_REQUEST);
    expect(response.body).toHaveProperty('errorMessage');
    expect(response.body.errorMessage).toEqual(ERROR_MESSAGE.DUPLICATE_EMAIL);
  });

  it('수강생 회원 가입 실패 - 이메일 형식 틀림', async () => {
    // given
    const studentRequest = { email: 'email@', nickname: 'NicknameABC' };

    // when
    const response = await request(app).post('/students').send(studentRequest);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.BAD_REQUEST);
    expect(response.body).toHaveProperty('errorMessage');
    expect(response.body.errorMessage).toContain(ERROR_MESSAGE.EMAIL_FORMAT);
  });

  it('수강생 회원 가입 실패 - 빈 이메일 입력', async () => {
    // given
    const studentRequest = { email: '', nickname: 'NicknameABC' };

    // when
    const response = await request(app).post('/students').send(studentRequest);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.BAD_REQUEST);
    expect(response.body).toHaveProperty('errorMessage');
    expect(response.body.errorMessage).toContain(ERROR_MESSAGE.EMAIL_FORMAT);
  });

  it('수강생 회원 가입 실패 - 빈 닉네임 입력', async () => {
    // given
    const studentRequest = { email: 'abc@gmail.com', nickname: '' };

    // when
    const response = await request(app).post('/students').send(studentRequest);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.BAD_REQUEST);
    expect(response.body).toHaveProperty('errorMessage');
    expect(response.body.errorMessage).toContain(
      ERROR_MESSAGE.STUDENT_NICKNAME_LENGTH,
    );
  });
});

describe('수강 신청', () => {
  let studentId: number;
  let openCourseIdOne: number;
  let openCourseIdTwo: number;
  let closeCourseIdOne: number;

  beforeAll(async () => {
    const connection = await mysql.getConnection();

    const student = { email: 'abc@gmail.com', nickname: 'NicknameABC' };
    studentId = (await request(app).post('/students').send(student)).body
      .signUpId;

    let [result] = await connection.query<ResultSetHeader>(
      'INSERT INTO course (instructor_id, is_public, title, description, price, category) ' +
        'VALUES (1, true, "JAVA ALGORITHM", "강의 소개입니다", 25000, "알고리즘");',
    );
    openCourseIdOne = result.insertId;

    [result] = await connection.query<ResultSetHeader>(
      'INSERT INTO course (instructor_id, is_public, title, description, price, category) ' +
        'VALUES (2, true, "NODEJS", "NODE와 EXPRESS에 대해서", 35000, "웹");',
    );
    openCourseIdTwo = result.insertId;

    [result] = await connection.query<ResultSetHeader>(
      'INSERT INTO course (instructor_id, is_public, title, description, price, category) ' +
        'VALUES (3, false, "Python", "This is Python", 12000, "웹");',
    );
    closeCourseIdOne = result.insertId;

    connection.release();
  });

  afterAll(truncateCourse);
  afterAll(truncateStudent);
  afterEach(truncateClass);

  it('수강 신청 성공 - 1개 신청시', async () => {
    // given
    const applyRequest = new ApplyClassRequest();
    applyRequest.courseIds = [openCourseIdOne];
    applyRequest.studentId = studentId;

    // when
    const response = await request(app)
      .post('/students/apply-class')
      .send(applyRequest);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.CREATED);
    expect(response.body.createdClassIds).toHaveLength(1);
    expect(response.body.alreadyAppliedCourseIds).toHaveLength(0);
    expect(response.body.appliedCourseIds).toContain(openCourseIdOne);
    expect(response.body.noExistCourseIds).toHaveLength(0);
    expect(response.body.noPublicCourseIds).toHaveLength(0);
  });

  it('수강 신청 성공 - 2개 신청시', async () => {
    // given
    const applyRequest = new ApplyClassRequest();
    applyRequest.courseIds = [openCourseIdOne, openCourseIdTwo];
    applyRequest.studentId = studentId;

    // when
    const response = await request(app)
      .post('/students/apply-class')
      .send(applyRequest);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.CREATED);
    expect(response.body.createdClassIds).toHaveLength(2);
    expect(response.body.alreadyAppliedCourseIds).toHaveLength(0);
    expect(response.body.appliedCourseIds).toEqual([
      openCourseIdOne,
      openCourseIdTwo,
    ]);
    expect(response.body.noExistCourseIds).toHaveLength(0);
    expect(response.body.noPublicCourseIds).toHaveLength(0);
  });

  it('수강 신청 실패 - 0개 신청시', async () => {
    // given
    const applyRequest = new ApplyClassRequest();
    applyRequest.studentId = studentId;

    // when
    const response = await request(app)
      .post('/students/apply-class')
      .send(applyRequest);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.BAD_REQUEST);
    expect(response.body).toHaveProperty('errorMessage');
    expect(response.body.errorMessage).toContain(
      ERROR_MESSAGE.EMPTY_COURSE_APPLY,
    );
  });

  it('수강 신청 실패 - 가입 되지 않은 수강생', async () => {
    // given
    const applyRequest = new ApplyClassRequest();
    applyRequest.courseIds = [openCourseIdOne, openCourseIdTwo];
    applyRequest.studentId = 9999;

    // when
    const response = await request(app)
      .post('/students/apply-class')
      .send(applyRequest);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.BAD_REQUEST);
    expect(response.body).toHaveProperty('errorMessage');
    expect(response.body.errorMessage).toEqual(ERROR_MESSAGE.STUDENT_NOT_FOUND);
  });

  it('수강 신청 실패 - 존재하지 않는 강의 신청', async () => {
    // given
    const applyRequest = new ApplyClassRequest();
    applyRequest.courseIds = [99991, 99992];
    applyRequest.studentId = studentId;

    // when
    const response = await request(app)
      .post('/students/apply-class')
      .send(applyRequest);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.OK);
    expect(response.body.createdClassIds).toHaveLength(0);
    expect(response.body.alreadyAppliedCourseIds).toHaveLength(0);
    expect(response.body.appliedCourseIds).toHaveLength(0);
    expect(response.body.noExistCourseIds).toHaveLength(2);
    expect(response.body.noPublicCourseIds).toHaveLength(0);
  });

  it('수강 신청 실패 - 비공개된 강의 신청', async () => {
    // given
    const applyRequest = new ApplyClassRequest();
    applyRequest.courseIds = [closeCourseIdOne];
    applyRequest.studentId = studentId;

    // when
    const response = await request(app)
      .post('/students/apply-class')
      .send(applyRequest);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.OK);
    expect(response.body.createdClassIds).toHaveLength(0);
    expect(response.body.alreadyAppliedCourseIds).toHaveLength(0);
    expect(response.body.appliedCourseIds).toHaveLength(0);
    expect(response.body.noExistCourseIds).toHaveLength(0);
    expect(response.body.noPublicCourseIds).toHaveLength(1);
  });
});

describe('수강생 회원 탈퇴', () => {
  afterEach(truncateStudent);
  afterEach(truncateCourse);

  it('수강생 회원 탈퇴 후 기존 식별 id 반환 성공', async () => {
    // given
    const student = { email: 'abc@gmail.com', nickname: 'NicknameABC' };
    const studentId = (await request(app).post('/students').send(student)).body
      .signUpId;

    // when
    const response = await request(app).delete(`/students/${studentId}`);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.OK);
    expect(response.body).toHaveProperty('removedStudentId');
    expect(response.body.removedStudentId).toEqual(studentId);
  });

  it('수강생 회원 탈퇴 후 수강 내역 삭제 성공', async () => {
    // given
    const connection = await mysql.getConnection();

    let [courseResult] = await connection.query<ResultSetHeader>(
      'INSERT INTO course (instructor_id, is_public, title, description, price, category) ' +
        'VALUES (1, true, "JAVA ALGORITHM", "강의 소개입니다", 25000, "알고리즘");',
    );

    const courseId = courseResult.insertId;
    const student = { email: 'abc@gmail.com', nickname: 'NicknameABC' };
    const studentId = (await request(app).post('/students').send(student)).body
      .signUpId;

    const applyRequest = new ApplyClassRequest();
    applyRequest.courseIds = [courseId];
    applyRequest.studentId = studentId;

    await request(app).post('/students/apply-class').send(applyRequest);

    let [classResult] = await connection.query<RowDataPacket[]>(
      `SELECT * FROM class WHERE student_id = ${studentId}`,
    );
    const classFoundBeforeCount = classResult.length;

    // when
    const response = await request(app).delete(`/students/${studentId}`);

    [classResult] = await connection.query<RowDataPacket[]>(
      `SELECT * FROM class WHERE student_id = ${studentId}`,
    );
    const classFoundAfterCount = classResult.length;

    connection.release();

    // then
    expect(classFoundBeforeCount).toEqual(1);
    expect(classFoundAfterCount).toEqual(0);
  });

  it('수강생 회원 탈퇴 후 해당 email 재사용 성공', async () => {
    // given
    const studentBefore = {
      email: 'first@gmail.com',
      nickname: 'firstNickname',
    };
    const studentBeforeId = (
      await request(app).post('/students').send(studentBefore)
    ).body.signUpId;

    const newStudent = { email: 'first@gmail.com', nickname: 'secondNickname' };

    // when
    await request(app).delete(`/students/${studentBeforeId}`);
    const response = await request(app).post('/students').send(newStudent);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.CREATED);
    expect(response.body).toHaveProperty('signUpId');
  });

  it('존재하지 않는 수강생 id 입력 후 실패', async () => {
    // given
    const id = 9999;

    // when
    const response = await request(app).delete(`/students/${id}`);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.BAD_REQUEST);
    expect(response.body).toHaveProperty('errorMessage');
    expect(response.body.errorMessage).toEqual(ERROR_MESSAGE.STUDENT_NOT_FOUND);
  });

  it('숫자 외의 parameter 입력 후 실패', async () => {
    // given
    const id = 'notNumber';

    // when
    const response = await request(app).delete(`/students/${id}`);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.BAD_REQUEST);
    expect(response.body).toHaveProperty('paramErrorMessages');
    expect(response.body.paramErrorMessages[0].msg).toEqual(
      ERROR_MESSAGE.REQUEST_PARAM,
    );
  });
});
