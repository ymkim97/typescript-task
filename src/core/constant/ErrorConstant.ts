export const ERROR_MESSAGE = {
  SQL_READ_ERROR: 'There is error with reading MYSQL',
  SQL_WRITE_ERROR: 'There is error with writing MYSQL',
  INVALID_COURSE_CATEGORY: 'Not a valid course category.',
  SERVER_ERROR: 'Server Error.',
  REQUEST_VALIDATION: 'Something wrong with request body.',
  INSTRUCTOR_NOT_FOUND: 'Instructor does not exist',
} as const;

export const ERROR_CODE = {
  NOT_FOUND_ERROR: 404,
  REQUEST_ERROR: 400,
  SERVER_ERROR: 500,
} as const;
