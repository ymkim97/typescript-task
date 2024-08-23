export const ERROR_MESSAGE = {
  SQL_ERROR: 'There is error with MYSQL',
  INVALID_COURSE_CATEGORY: 'Not a valid course category.',
  SERVER_ERROR: 'Server Error.',
  REQUEST_VALIDATION: 'Something wrong with request body.',
} as const;

export const ERROR_CODE = {
  NOT_FOUND_ERROR: 404,
  REQUEST_ERROR: 400,
  SERVER_ERROR: 500,
} as const;
