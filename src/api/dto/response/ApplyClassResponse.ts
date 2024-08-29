import CourseAvailability from '@dto/type/CourseAvailability';

export default class ApplyClassResponse {
  constructor(
    readonly createdClassIds: number[],
    readonly alreadyAppliedCourseIds: number[],
    readonly appliedCourseIds: number[],
    readonly noExistCourseIds: number[],
    readonly noPublicCourseIds: number[],
  ) {}

  public static from(
    courseAvailability: CourseAvailability,
    createdClassIds: number[],
  ) {
    return new ApplyClassResponse(
      createdClassIds,
      courseAvailability.alreadyApplied,
      courseAvailability.available,
      courseAvailability.noExist,
      courseAvailability.noPublic,
    );
  }
}
