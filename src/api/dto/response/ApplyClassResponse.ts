import CourseAvailability from '@dto/type/CourseAvailability';

export default class ApplyClassResponse {
  createdClassIds: number[];
  alreadyAppliedCourseIds: number[];
  appliedCourseIds: number[];
  noExistCourseIds: number[];
  noPublicCourseIds: number[];

  constructor(
    createdClassIds: number[],
    alreadyAppliedCourseIds: number[],
    appliedCourseIds: number[],
    noExistCourseIds: number[],
    noPublicCourseIds: number[],
  ) {
    this.createdClassIds = createdClassIds;
    this.alreadyAppliedCourseIds = alreadyAppliedCourseIds;
    this.appliedCourseIds = appliedCourseIds;
    this.noExistCourseIds = noExistCourseIds;
    this.noPublicCourseIds = noPublicCourseIds;
  }

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
