export const ERROR_MESSAGE = {
  DATA_NOT_FOUND: 'Data not found in MYSQL.',
  INVALID_COURSE_CATEGORY: 'Not a valid course category.',
  SERVER_ERROR: 'Server Error.',
  REQUEST_VALIDATION: 'Something wrong with request body.',
} as const;

export const ERROR_CODE = {
  NOT_FOUND_ERROR: 404,
  REQUEST_ERROR: 400,
  SERVER_ERROR: 500,
} as const;
