export const ERROR_MESSAGE = {
  SQL_READ_ERROR: 'MYSQL 읽기 작업 에러',
  SQL_WRITE_ERROR: 'MYSQL 쓰기 작업 에러',
  SQL_ROLLBACK: '데이터가 Rollback 되었습니다.',
  INVALID_COURSE_CATEGORY: '올바르지 못한 카테고리입니다',
  SERVER_ERROR: '===== Server Error. =====',
  REQUEST_VALIDATION: 'Request body 값이 올바르지 못합니다.',
  INSTRUCTOR_NOT_FOUND: '존재하지 않는 강사입니다.',
  INSTRUCTOR_ID_NOT_UNIFIED: '모든 요청이 같은 강사가 아닙니다.',
  COURSE_BULK_TOO_MUCH: '최대 10개의 강의를 등록할 수 있습니다.',
  COURSE_NOT_FOUND: '존재하지 않는 강의입니다.',
  COURSE_FORBIDDEN: '해당 강의의 강사만 수정할 수 있습니다.',
} as const;

export const ERROR_CODE = {
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  REQUEST: 400,
  SERVER: 500,
} as const;
