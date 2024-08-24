import { singleton } from 'tsyringe';

import { ERROR_CODE, ERROR_MESSAGE } from '@constant/ErrorConstant';
import { CreateCourseRequest } from '@dto/request/CreateCourseRequest';
import NotFoundError from '@error/NotFoundError';
import CourseRepository from '@repository/CourseRepository';
import InstructorService from './InstructorService';

@singleton()
export default class CourseService {
  private courseRepository: CourseRepository;
  private instructorService: InstructorService;

  constructor(
    courseRepository: CourseRepository,
    instructorService: InstructorService,
  ) {
    this.courseRepository = courseRepository;
    this.instructorService = instructorService;
  }

  public async registerNew(
    createCourseRequest: CreateCourseRequest,
  ): Promise<number | void> {
    const instructorId = createCourseRequest.instructorId;
    await this.validateInstructor(instructorId);

    const course = createCourseRequest.toEntity();
    const newCourseId = await this.courseRepository.save(course);

    return newCourseId;
  }

  private async validateInstructor(instructorId: number): Promise<void> {
    const isInstructorRegistered =
      await this.instructorService.isExist(instructorId);

    if (!isInstructorRegistered) {
      throw new NotFoundError(
        ERROR_MESSAGE.INSTRUCTOR_NOT_FOUND,
        ERROR_CODE.NOT_FOUND_ERROR,
      );
    }
  }
}
