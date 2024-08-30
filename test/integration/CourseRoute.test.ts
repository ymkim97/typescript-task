import request from 'supertest';

import { ERROR_MESSAGE } from '@constant/ErrorMessageConstant';
import { STATUS_CODE } from '@constant/StatusConstant';
import ApplyClassRequest from '@dto/request/ApplyClassRequest';
import { app, mysql } from '@test/setup-test';
import { truncateClass, truncateCourse, truncateStudent } from '@test/testUtil';
import { RowDataPacket } from 'mysql2';

describe('강의 등록', () => {
  afterEach(truncateCourse);

  it('강의 등록 성공 - 식별 id 반환', async () => {
    // given
    const courseRequest = {
      instructorId: 1,
      title: 'NestJS란',
      description: '강의 소개',
      price: 6000,
      category: '웹',
    };

    // when
    const response = await request(app).post('/courses').send(courseRequest);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.CREATED);
    expect(response.body).toHaveProperty('insertedCourseId');
  });

  it('강의 등록 성공 - 처음 생성시 비공개 상태', async () => {
    // given
    const courseRequest = {
      instructorId: 1,
      title: 'NestJS란',
      description: '강의 소개',
      price: 6000,
      category: '웹',
    };

    // when
    const response = await request(app).post('/courses').send(courseRequest);
    const connection = await mysql.getConnection();
    const [result] = await connection.query<RowDataPacket[]>(
      `SELECT is_public FROM course WHERE ${response.body.insertedCourseId}`,
    );
    connection.release();
    const isPublic = result[0]['is_public'];

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.CREATED);
    expect(isPublic).toBeFalsy();
  });

  it('강의 등록 실패 - 올바르지 않은 카테고리', async () => {
    // given
    const courseRequest = {
      instructorId: 1,
      title: 'NestJS란',
      description: '강의 소개',
      price: 6000,
      category: 'SomethingElse',
    };

    // when
    const response = await request(app).post('/courses').send(courseRequest);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.BAD_REQUEST);
    expect(response.body).toHaveProperty('errorMessage');
    expect(response.body.errorMessage).toContain(
      ERROR_MESSAGE.COURSE_INVALID_CATEGORY,
    );
  });

  it('강의 등록 실패 - 중복된 강의명', async () => {
    // given
    const courseRequestOne = {
      instructorId: 1,
      title: 'NestJS란',
      description: '강의 소개',
      price: 6000,
      category: '웹',
    };

    const courseRequestTwo = {
      instructorId: 2,
      title: 'NestJS란',
      description: '다른 강의입니다.',
      price: 12500,
      category: '웹',
    };

    // when
    await request(app).post('/courses').send(courseRequestOne);
    const response = await request(app).post('/courses').send(courseRequestTwo);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.BAD_REQUEST);
    expect(response.body).toHaveProperty('errorMessage');
    expect(response.body.errorMessage).toContain(
      ERROR_MESSAGE.COURSE_DUPLICATE_TITLE,
    );
  });

  it('강의 등록 실패 - 존재하지 않는 강사가 신청', async () => {
    // given
    const courseRequest = {
      instructorId: 9999,
      title: 'NestJS란',
      description: '강의 소개',
      price: 6000,
      category: '웹',
    };

    // when
    const response = await request(app).post('/courses').send(courseRequest);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.NOT_FOUND);
    expect(response.body).toHaveProperty('errorMessage');
    expect(response.body.errorMessage).toContain(
      ERROR_MESSAGE.INSTRUCTOR_NOT_FOUND,
    );
  });
});

describe('강의 대량 등록', () => {
  afterEach(truncateCourse);

  it('강의 대량 등록 성공 - 식별 id 리스트 반환', async () => {
    // given
    const courseRequestOne = {
      instructorId: 1,
      title: 'NestJS란',
      description: '강의 소개',
      price: 6000,
      category: '웹',
    };

    const courseRequestTwo = {
      instructorId: 1,
      title: '두번째 강의',
      description: '노드',
      price: 3000,
      category: '웹',
    };

    const courseBulkRequest = { courses: [courseRequestOne, courseRequestTwo] };

    // when
    const response = await request(app)
      .post('/courses/bulk')
      .send(courseBulkRequest);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.CREATED);
    expect(response.body).toHaveProperty('insertedCourseIds');
  });

  it('강의 대량 등록 실패 - 모든 강사 식별자가 같지 않을때', async () => {
    // given
    const courseRequestOne = {
      instructorId: 1,
      title: 'NestJS란',
      description: '강의 소개',
      price: 6000,
      category: '웹',
    };

    const courseRequestTwo = {
      instructorId: 5,
      title: '두번째 강의',
      description: '노드',
      price: 3000,
      category: '웹',
    };

    const courseBulkRequest = { courses: [courseRequestOne, courseRequestTwo] };

    // when
    const response = await request(app)
      .post('/courses/bulk')
      .send(courseBulkRequest);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.BAD_REQUEST);
    expect(response.body).toHaveProperty('errorMessage');
    expect(response.body.errorMessage).toEqual(
      ERROR_MESSAGE.INSTRUCTOR_ID_NOT_UNIFIED,
    );
  });

  it('강의 대량 등록 실패 - 요청 내 중복된 강의명', async () => {
    // given
    const courseRequestOne = {
      instructorId: 1,
      title: 'NestJS란',
      description: '강의 소개',
      price: 6000,
      category: '웹',
    };

    const courseRequestTwo = {
      instructorId: 1,
      title: 'NestJS란',
      description: '노드',
      price: 3000,
      category: '웹',
    };

    const courseBulkRequest = { courses: [courseRequestOne, courseRequestTwo] };

    // when
    const response = await request(app)
      .post('/courses/bulk')
      .send(courseBulkRequest);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.BAD_REQUEST);
    expect(response.body).toHaveProperty('errorMessage');
    expect(response.body.errorMessage).toEqual(
      ERROR_MESSAGE.COURSE_DUPLICATE_TITLE_IN_REQ,
    );
  });

  it('강의 대량 등록 실패 - 10개 초과 등록', async () => {
    // given
    const requestArray = Array(11).fill({});

    const courseBulkRequest = { courses: requestArray };

    // when
    const response = await request(app)
      .post('/courses/bulk')
      .send(courseBulkRequest);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.BAD_REQUEST);
    expect(response.body).toHaveProperty('errorMessage');
    expect(response.body.errorMessage).toContain(
      ERROR_MESSAGE.COURSE_BULK_TOO_MUCH,
    );
  });

  it('강의 대량 등록 실패 - 0개 등록', async () => {
    // given
    const courseBulkRequest = { courses: [] };

    // when
    const response = await request(app)
      .post('/courses/bulk')
      .send(courseBulkRequest);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.BAD_REQUEST);
    expect(response.body).toHaveProperty('errorMessage');
    expect(response.body.errorMessage).toContain(
      ERROR_MESSAGE.COURSE_BULK_EMPTY,
    );
  });
});

describe('강의 수정', () => {
  afterEach(truncateCourse);

  it('강의 수정 성공 - 식별 id 반환', async () => {
    // given
    const courseRequest = {
      instructorId: 1,
      title: 'NestJS란',
      description: '강의 소개',
      price: 6000,
      category: '웹',
    };

    const courseId = (await request(app).post('/courses').send(courseRequest))
      .body.insertedCourseId;

    const updateCourseRequest = {
      instructorId: 1,
      title: '바뀐 제목',
      description: '바뀐 소개',
      price: 2000,
    };

    // when
    const response = await request(app)
      .put(`/courses/${courseId}`)
      .send(updateCourseRequest);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.OK);
    expect(response.body).toHaveProperty('updatedCourseId');
    expect(response.body.updatedCourseId).toEqual(courseId);
  });

  it('강의 수정 성공 - 변경된 사항 저장', async () => {
    // given
    const courseRequest = {
      instructorId: 1,
      title: 'NestJS란',
      description: '강의 소개',
      price: 6000,
      category: '웹',
    };

    const courseId = (await request(app).post('/courses').send(courseRequest))
      .body.insertedCourseId;

    const titleToChange = '바뀐 제목';
    const descriptionToChange = '바뀐 소개';
    const priceToChange = 2000;

    const updateCourseRequest = {
      instructorId: 1,
      title: titleToChange,
      description: descriptionToChange,
      price: priceToChange,
    };

    // when
    const response = await request(app)
      .put(`/courses/${courseId}`)
      .send(updateCourseRequest);

    const connection = await mysql.getConnection();
    const [result] = await connection.query<RowDataPacket[]>(
      `SELECT * FROM course WHERE id = ${courseId}`,
    );
    const updatedCourse = result[0];
    connection.release();

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.OK);
    expect(updatedCourse['title']).toEqual(titleToChange);
    expect(updatedCourse['description']).toEqual(descriptionToChange);
    expect(updatedCourse['price']).toEqual(priceToChange);
  });

  it('강의 수정 실패 - 일치하지 않는 강사 id', async () => {
    // given
    const courseRequest = {
      instructorId: 1,
      title: 'NestJS란',
      description: '강의 소개',
      price: 6000,
      category: '웹',
    };

    const courseId = (await request(app).post('/courses').send(courseRequest))
      .body.insertedCourseId;

    const titleToChange = '바뀐 제목';
    const descriptionToChange = '바뀐 소개';
    const priceToChange = 2000;

    const updateCourseRequest = {
      instructorId: 2,
      title: titleToChange,
      description: descriptionToChange,
      price: priceToChange,
    };

    // when
    const response = await request(app)
      .put(`/courses/${courseId}`)
      .send(updateCourseRequest);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.BAD_REQUEST);
    expect(response.body).toHaveProperty('errorMessage');
    expect(response.body.errorMessage).toEqual(ERROR_MESSAGE.COURSE_FORBIDDEN);
  });
});

describe('강의 오픈', () => {
  const instructorId = 1;
  let courseId: number;

  beforeEach(async () => {
    const courseRequest = {
      instructorId: instructorId,
      title: 'NestJS란',
      description: '강의 소개',
      price: 6000,
      category: '웹',
    };

    const response = await request(app).post('/courses').send(courseRequest);
    courseId = response.body.insertedCourseId;
  });

  afterEach(truncateCourse);

  it('강의 오픈 성공 - 식별 id 반환', async () => {
    // given
    const openCourseRequest = { instructorId: instructorId };

    // when
    const response = await request(app)
      .put(`/courses/open/${courseId}`)
      .send(openCourseRequest);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.OK);
  });

  it('강의 오픈 성공 - 강의 공개 상태', async () => {
    // given
    const openCourseRequest = { instructorId: instructorId };

    // when
    await request(app).put(`/courses/open/${courseId}`).send(openCourseRequest);

    const connection = await mysql.getConnection();
    const [result] = await connection.query<RowDataPacket[]>(
      `SELECT is_public FROM course WHERE id = ${courseId}`,
    );
    const isPublic = result[0]['is_public'];
    connection.release();

    // then
    expect(isPublic).toBeTruthy();
  });

  it('강의 오픈 실패 - 해당 강사가 아닐때', async () => {
    // given
    const openCourseRequest = { instructorId: 999 };

    // when
    const response = await request(app)
      .put(`/courses/open/${courseId}`)
      .send(openCourseRequest);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.BAD_REQUEST);
    expect(response.body).toHaveProperty('errorMessage');
    expect(response.body.errorMessage).toEqual(ERROR_MESSAGE.COURSE_FORBIDDEN);
  });
});

describe('강의 삭제', () => {
  const instructorId = 1;
  let courseId: number;

  beforeEach(async () => {
    const courseRequest = {
      instructorId: instructorId,
      title: 'NestJS란',
      description: '강의 소개',
      price: 6000,
      category: '웹',
    };

    const response = await request(app).post('/courses').send(courseRequest);
    courseId = response.body.insertedCourseId;
  });

  afterEach(truncateCourse);
  afterEach(truncateStudent);
  afterEach(truncateClass);

  it('강의 삭제 성공 - 식별 id 반환', async () => {
    // given
    const deleteCourseRequest = { instructorId: instructorId };

    // when
    const response = await request(app)
      .delete(`/courses/${courseId}`)
      .send(deleteCourseRequest);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.OK);
    expect(response.body).toHaveProperty('deletedCourseId');
    expect(response.body.deletedCourseId).toEqual(courseId);
  });

  it('강의 삭제 실패 - 수강생이 이미 있는 경우', async () => {
    // given
    const openCourseRequest = { instructorId: instructorId };
    await request(app).put(`/courses/open/${courseId}`).send(openCourseRequest);

    const deleteCourseRequest = { instructorId: instructorId };
    const student = { email: 'aaa@gmail.com', nickname: 'NicknameAAA' };
    const studentId = (await request(app).post('/students').send(student)).body
      .signUpId;

    const applyRequest = new ApplyClassRequest();
    applyRequest.courseIds = [courseId];
    applyRequest.studentId = studentId;
    await request(app).post('/students/apply-class').send(applyRequest);

    // when
    const response = await request(app)
      .delete(`/courses/${courseId}`)
      .send(deleteCourseRequest);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.BAD_REQUEST);
    expect(response.body).toHaveProperty('errorMessage');
    expect(response.body.errorMessage).toEqual(
      ERROR_MESSAGE.COURSE_HAS_STUDENTS,
    );
  });

  it('강의 삭제 실패 - 해당 강사의 요청이 아닐때', async () => {
    // given
    const deleteCourseRequest = { instructorId: 99 };

    // when
    const response = await request(app)
      .delete(`/courses/${courseId}`)
      .send(deleteCourseRequest);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.BAD_REQUEST);
    expect(response.body).toHaveProperty('errorMessage');
    expect(response.body.errorMessage).toEqual(ERROR_MESSAGE.COURSE_FORBIDDEN);
  });
});

describe('강의 상세 조회', () => {
  afterEach(truncateCourse);
  afterEach(truncateStudent);
  afterEach(truncateClass);

  it('강의 상세 조회 성공 - 공개된 강의 반환', async () => {
    // given
    const courseId = 200;
    const studentId = 300;
    const title = 'JAVA ALGORITHM';
    const description = 'THIS IS DESCRIPTION';
    const price = 25000;
    const category = '알고리즘';
    const isPublic = true;
    const email = 'fff@gmail.com';
    const nickname = '닉네임6';

    const connection = await mysql.getConnection();
    await connection.query(
      `INSERT INTO course(id, instructor_id, is_public, title, description, price, category)
       VALUES (${courseId}, 1, ${isPublic}, '${title}', '${description}', '${price}', '${category}');`,
    );
    await connection.query(
      `INSERT INTO student(id, email, nickname)
       VALUES (${studentId}, '${email}', '${nickname}');`,
    );
    await connection.query(
      `INSERT INTO class(student_id, course_id) VALUES (${studentId}, ${courseId});`,
    );
    connection.release();

    // when
    const response = await request(app).get(`/courses/${courseId}`);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.OK);
    expect(response.body.title).toEqual(title);
    expect(response.body.description).toEqual(description);
    expect(response.body.category).toEqual(category);
    expect(response.body.price).toEqual(price);
    expect(response.body.students[0].nickname).toEqual(nickname);
    expect(response.body.students[0]).toHaveProperty('appliedOn');
    expect(response.body).toHaveProperty('publishedOn');
    expect(response.body).toHaveProperty('updatedOn');
  });

  it('강의 상세 조회 성공 - 비공개된 강의 반환', async () => {
    // given
    const courseId = 200;
    const studentId = 300;
    const title = 'JAVA ALGORITHM';
    const description = 'THIS IS DESCRIPTION';
    const price = 25000;
    const category = '알고리즘';
    const isPublic = false;
    const email = 'fff@gmail.com';
    const nickname = '닉네임6';

    const connection = await mysql.getConnection();
    await connection.query(
      `INSERT INTO course(id, instructor_id, is_public, title, description, price, category)
       VALUES (${courseId}, 1, ${isPublic}, '${title}', '${description}', '${price}', '${category}');`,
    );
    await connection.query(
      `INSERT INTO student(id, email, nickname)
       VALUES (${studentId}, '${email}', '${nickname}');`,
    );
    await connection.query(
      `INSERT INTO class(student_id, course_id) VALUES (${studentId}, ${courseId});`,
    );
    connection.release();

    // when
    const response = await request(app).get(`/courses/${courseId}`);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.OK);
    expect(response.body.title).toEqual(title);
    expect(response.body.description).toEqual(description);
    expect(response.body.category).toEqual(category);
    expect(response.body.price).toEqual(price);
    expect(response.body.students[0].nickname).toEqual(nickname);
    expect(response.body.students[0]).toHaveProperty('appliedOn');
    expect(response.body).toHaveProperty('publishedOn');
    expect(response.body).toHaveProperty('updatedOn');
  });

  it('강의 상세 조회 성공 - 없는 강의 id는 빈 객체 반환', async () => {
    // given
    const course_id = 999;

    // when
    const response = await request(app).get(`/courses/${course_id}`);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.OK);
    expect(response.body).toEqual({});
  });
});

describe('강의 목록 조회', () => {
  afterEach(truncateCourse);
  afterEach(truncateStudent);
  afterEach(truncateClass);

  it('강의 목록 조회(강사명, 강의명 검색) 성공 - 공개된 강의 반환', async () => {
    // given
    const courseId = 200;
    const studentId = 300;
    const title = 'JAVA ALGORITHM';
    const description = 'THIS IS DESCRIPTION';
    const price = 25000;
    const category = '알고리즘';
    const isPublic = true;
    const email = 'fff@gmail.com';
    const nickname = '닉네임6';
    const queries = {
      type: 'instructorAndTitle',
      keyword: 'JAVA ALGORITHM',
      category: 'all',
      pageNumber: 1,
      pageSize: 10,
      sort: 'recent',
    };

    const connection = await mysql.getConnection();
    await connection.query(
      `INSERT INTO course(id, instructor_id, is_public, title, description, price, category)
       VALUES (${courseId}, 1, ${isPublic}, '${title}', '${description}', '${price}', '${category}');`,
    );
    await connection.query(
      `INSERT INTO student(id, email, nickname)
       VALUES (${studentId}, '${email}', '${nickname}');`,
    );
    await connection.query(
      `INSERT INTO class(student_id, course_id) VALUES (${studentId}, ${courseId});`,
    );
    connection.release();

    // when
    const response = await request(app).get('/courses/search').query(queries);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.OK);
    expect(response.body).toHaveProperty('courses');
    expect(response.body.courses[0].id).toEqual(courseId);
    expect(response.body.courses[0].category).toEqual(category);
    expect(response.body.courses[0].title).toEqual(title);
    expect(response.body.courses[0].instructorName).toEqual('향로');
    expect(response.body.courses[0].price).toEqual(price);
  });

  it('강의 목록 조회(강사명, 강의명 검색) 성공 - 비공개된 강의는 반환하지 않음', async () => {
    // given
    const courseId = 200;
    const studentId = 300;
    const title = 'JAVA ALGORITHM';
    const description = 'THIS IS DESCRIPTION';
    const price = 25000;
    const category = '알고리즘';
    const isPublic = false;
    const email = 'fff@gmail.com';
    const nickname = '닉네임6';
    const queries = {
      type: 'instructorAndTitle',
      keyword: 'JAVA ALGORITHM',
      category: 'all',
      pageNumber: 1,
      pageSize: 10,
      sort: 'recent',
    };

    const connection = await mysql.getConnection();
    await connection.query(
      `INSERT INTO course(id, instructor_id, is_public, title, description, price, category)
       VALUES (${courseId}, 1, ${isPublic}, '${title}', '${description}', '${price}', '${category}');`,
    );
    await connection.query(
      `INSERT INTO student(id, email, nickname)
       VALUES (${studentId}, '${email}', '${nickname}');`,
    );
    await connection.query(
      `INSERT INTO class(student_id, course_id) VALUES (${studentId}, ${courseId});`,
    );
    connection.release();

    // when
    const response = await request(app).get('/courses/search').query(queries);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.OK);
    expect(response.body.courses).toHaveLength(0);
  });

  it('강의 목록 조회(수강생 식별자 검색) 성공 - 공개된 강의 반환', async () => {
    // given
    const courseId = 200;
    const studentId = 300;
    const title = 'JAVA ALGORITHM';
    const description = 'THIS IS DESCRIPTION';
    const price = 25000;
    const category = '알고리즘';
    const isPublic = true;
    const email = 'fff@gmail.com';
    const nickname = '닉네임6';
    const queries = {
      type: 'studentId',
      keyword: `${studentId}`,
      category: 'all',
      pageNumber: 1,
      pageSize: 10,
      sort: 'recent',
    };

    const connection = await mysql.getConnection();
    await connection.query(
      `INSERT INTO course(id, instructor_id, is_public, title, description, price, category)
       VALUES (${courseId}, 1, ${isPublic}, '${title}', '${description}', '${price}', '${category}');`,
    );
    await connection.query(
      `INSERT INTO student(id, email, nickname)
       VALUES (${studentId}, '${email}', '${nickname}');`,
    );
    await connection.query(
      `INSERT INTO class(student_id, course_id) VALUES (${studentId}, ${courseId});`,
    );
    connection.release();

    // when
    const response = await request(app).get('/courses/search').query(queries);

    // then
    expect(response.statusCode).toEqual(STATUS_CODE.OK);
    expect(response.body).toHaveProperty('courses');
    expect(response.body.courses[0].id).toEqual(courseId);
    expect(response.body.courses[0].category).toEqual(category);
    expect(response.body.courses[0].title).toEqual(title);
    expect(response.body.courses[0].instructorName).toEqual('향로');
    expect(response.body.courses[0].price).toEqual(price);
  });
});
