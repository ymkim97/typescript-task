export const CATEGORY_VALUES = {
  WEB: '웹',
  APP: '앱',
  GAME: '게임',
  ALGORITHM: '알고리즘',
  INFRA: '인프라',
  DATABASE: '데이터베이스',
} as const;

export type CourseCategory =
  (typeof CATEGORY_VALUES)[keyof typeof CATEGORY_VALUES];
