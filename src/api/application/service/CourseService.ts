import { singleton } from 'tsyringe';

import { ERROR_CODE, ERROR_MESSAGE } from '@constant/ErrorConstant';
import CreateBulkCourseRequest from '@dto/request/CreateBulkCourseRequest';
import CreateCourseRequest from '@dto/request/CreateCourseRequest';
import UpdateCourseRequest from '@dto/request/UpdateCourseRequest';
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
  ): Promise<number> {
    const instructorId = createCourseRequest.instructorId;
    await this.validateInstructor(instructorId);

    const course = createCourseRequest.toEntity();
    const newCourseId = await this.courseRepository.save(course);

    return newCourseId;
  }

  public async registerNewBulk(
    createBulkCourseRequest: CreateBulkCourseRequest,
  ): Promise<number[]> {
    const requests = createBulkCourseRequest.createCourseRequest;
    const firstInstructorId = requests[0].instructorId;

    requests.forEach((x) => {
      if (x.instructorId !== firstInstructorId)
        throw new RequestError(
          ERROR_MESSAGE.INSTRUCTOR_ID_NOT_UNIFIED,
          ERROR_CODE.REQUEST,
        );
    });

    await this.validateInstructor(firstInstructorId);

    const courses = requests.map((x) => x.toEntity());
    const newCourseIds = await this.courseRepository.saveAll(courses);

    return newCourseIds;
  }

  public async update(
    id: number,
    updateCourseRequest: UpdateCourseRequest,
  ): Promise<void> {
    const course = await this.courseRepository.findById(id);

    if (!course) {
      throw new NotFoundError(
        ERROR_MESSAGE.COURSE_NOT_FOUND,
        ERROR_CODE.NOT_FOUND,
      );
    }

    if (course.instructorId !== updateCourseRequest.instructorId) {
      throw new RequestError(
        ERROR_MESSAGE.COURSE_FORBIDDEN,
        ERROR_CODE.FORBIDDEN,
      );
    }

    course.update = updateCourseRequest;
    await this.courseRepository.update(course);
  }

  private async validateInstructor(instructorId: number): Promise<void> {
    const isInstructorRegistered =
      await this.instructorService.isExist(instructorId);

    if (!isInstructorRegistered) {
      throw new NotFoundError(
        ERROR_MESSAGE.INSTRUCTOR_NOT_FOUND,
        ERROR_CODE.NOT_FOUND,
      );
    }
  }
}
