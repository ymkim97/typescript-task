export const ERROR_MESSAGE = {
  SQL_READ_ERROR: 'MYSQL 읽기 작업 에러',
  SQL_WRITE_ERROR: 'MYSQL 쓰기 작업 에러',
  SQL_ROLLBACK: '데이터가 Rollback 되었습니다.',
  SERVER_ERROR: '===== Server Error. =====',
  REQUEST_VALIDATION: 'Request body 값이 올바르지 못합니다.',

  INSTRUCTOR_NOT_FOUND: '존재하지 않는 강사입니다.',
  INSTRUCTOR_ID_NOT_UNIFIED: '모든 요청이 같은 강사가 아닙니다.',

  COURSE_BULK_TOO_MUCH: '최대 10개의 강의를 등록할 수 있습니다.',
  COURSE_BULK_EMPTY: '최소 1개 이상의 강의를 등록해야 합니다.',
  COURSE_NOT_FOUND: '존재하지 않는 강의입니다.',
  COURSE_FORBIDDEN: '해당 강의의 강사만 수정 또는 삭제할 수 있습니다.',
  COURSE_ALREADY_OPEN: '이미 오픈된 강의입니다.',
  COURSE_HAS_STUDENTS: '이미 수강생이 있는 경우 삭제할 수 없습니다. ',
  COURSE_DUPLICATE_TITLE: '중복된 강의명입니다.',
  COURSE_INVALID_CATEGORY: '올바르지 못한 카테고리입니다',

  DUPLICATE_EMAIL: '중복된 이메일입니다.',
} as const;
