export const ERROR_MESSAGE = {
  SQL_ERROR: 'MYSQL 작업 에러',
  SQL_ROLLBACK: '데이터가 Rollback 되었습니다.',
  SERVER_ERROR: '===== Server Error. =====',

  REQUEST_BODY_VALIDATION: 'Request body 값이 올바르지 못합니다.',
  REQUEST_SEARCH_QUERY: '올바르지 못한 검색 쿼리입니다.',
  REQUEST_PARAM: '올바르지 못한 parameter입니다',

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

  STUDENT_NOT_FOUND: '존재하지 않는 수강생입니다.',
  STUDENT_NICKNAME_LENGTH: '닉네임을 1글자 이상 30이하로 적어주세요',
  DUPLICATE_EMAIL: '중복된 이메일입니다.',
  EMAIL_FORMAT: '이메일을 입력해주세요.',
  EMPTY_COURSE_APPLY: '한 개 이상의 강의를 신청해야 합니다.',
} as const;
