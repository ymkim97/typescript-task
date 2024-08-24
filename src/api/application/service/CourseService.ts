import { singleton } from 'tsyringe';

import { ERROR_CODE, ERROR_MESSAGE } from '@constant/ErrorConstant';
import CreateBulkCourseRequest from '@dto/request/CreateBulkCourseRequest';
import CreateCourseRequest from '@dto/request/CreateCourseRequest';
import NotFoundError from '@error/NotFoundError';
import RequestError from '@error/RequestError';
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

  public async registerNewBulk(
    createBulkCourseRequest: CreateBulkCourseRequest,
  ): Promise<number[] | void> {
    const requests = createBulkCourseRequest.createCourseRequest;
    const instructorId = requests[0].instructorId;

    await this.validateInstructorIds(instructorId, requests);

    const courses = requests.map((x) => x.toEntity());
    const newCourseIds = await this.courseRepository.saveAll(courses);

    return newCourseIds;
  }

  private async validateInstructorIds(
    firstId: number,
    requests: CreateCourseRequest[],
  ): Promise<void> {
    requests.forEach((x) => {
      if (x.instructorId !== firstId)
        throw new RequestError(
          ERROR_MESSAGE.INSTRUCTOR_ID_NOT_UNIFIED,
          ERROR_CODE.REQUEST_ERROR,
        );
    });

    await this.validateInstructor(firstId);
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
