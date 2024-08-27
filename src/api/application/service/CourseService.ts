import { singleton } from 'tsyringe';

import { ERROR_MESSAGE } from '@constant/ErrorMessageConstant';
import { DUPLICATE_ENTRY, FOREIGN_KEY_CONSTRAINT } from '@constant/MysqlErrors';
import { STATUS_CODE } from '@constant/StatusConstant';
import CreateBulkCourseRequest from '@dto/request/CreateBulkCourseRequest';
import CreateCourseRequest from '@dto/request/CreateCourseRequest';
import DeleteCourseRequest from '@dto/request/DeleteCourseRequest';
import OpenCourseRequest from '@dto/request/OpenCourseRequest';
import UpdateCourseRequest from '@dto/request/UpdateCourseRequest';
import NotFoundError from '@error/NotFoundError';
import RequestError from '@error/RequestError';
import SqlError from '@error/SqlError';
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

    return await this.courseRepository.save(course).catch((e: SqlError) => {
      const mysqlError = e.originalError as any;

      if (mysqlError.errno === DUPLICATE_ENTRY) {
        throw new RequestError(
          ERROR_MESSAGE.COURSE_DUPLICATE_TITLE,
          STATUS_CODE.BAD_REQUEST,
        );
      } else throw e;
    });
  }

  public async registerNewBulk(
    createBulkCourseRequest: CreateBulkCourseRequest,
  ): Promise<number[]> {
    const requests = createBulkCourseRequest.createCourseRequest;
    const firstInstructorId = requests[0].instructorId;
    const titles: string[] = [];

    requests.forEach((x) => {
      if (x.instructorId !== firstInstructorId)
        throw new RequestError(
          ERROR_MESSAGE.INSTRUCTOR_ID_NOT_UNIFIED,
          STATUS_CODE.BAD_REQUEST,
        );
      titles.push(x.title);
    });

    await this.validateInstructor(firstInstructorId);
    await this.checkTitles(titles);

    const coursesToSave = requests.map((x) => x.toEntity());

    return await this.courseRepository.saveAll(coursesToSave);
  }

  public async update(
    id: number,
    updateCourseRequest: UpdateCourseRequest,
  ): Promise<void> {
    const course = await this.courseRepository.findById(id);

    if (!course) {
      throw new NotFoundError(
        ERROR_MESSAGE.COURSE_NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }

    this.authorizeInstructor(
      course.instructorId,
      updateCourseRequest.instructorId,
    );

    course.update = updateCourseRequest;

    await this.courseRepository.update(course);
  }

  public async open(
    courseId: number,
    openCourseRequest: OpenCourseRequest,
  ): Promise<void> {
    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      throw new NotFoundError(
        ERROR_MESSAGE.COURSE_NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }

    this.authorizeInstructor(
      course.instructorId,
      openCourseRequest.instructorId,
    );

    if (course.isPublic) {
      throw new RequestError(
        ERROR_MESSAGE.COURSE_ALREADY_OPEN,
        STATUS_CODE.BAD_REQUEST,
      );
    }

    await this.courseRepository.updatePublic(course);
  }

  public async delete(
    courseId: number,
    deleteCourseRequest: DeleteCourseRequest,
  ): Promise<void> {
    const course = await this.courseRepository.findById(courseId);

    if (!course) {
      throw new NotFoundError(
        ERROR_MESSAGE.COURSE_NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }

    this.authorizeInstructor(
      course.instructorId,
      deleteCourseRequest.instructorId,
    );

    await this.courseRepository.delete(course).catch((e: SqlError) => {
      const mysqlError = e.originalError as any;

      if (mysqlError.errno === FOREIGN_KEY_CONSTRAINT) {
        throw new RequestError(
          ERROR_MESSAGE.COURSE_HAS_STUDENTS,
          STATUS_CODE.BAD_REQUEST,
        );
      } else throw e;
    });
  }

  private async validateInstructor(instructorId: number): Promise<void> {
    const isInstructorRegistered =
      await this.instructorService.isExist(instructorId);

    if (!isInstructorRegistered) {
      throw new NotFoundError(
        ERROR_MESSAGE.INSTRUCTOR_NOT_FOUND,
        STATUS_CODE.NOT_FOUND,
      );
    }
  }

  private authorizeInstructor(
    instructorId: number,
    requestInstructorId: number,
  ): void {
    if (instructorId !== requestInstructorId) {
      throw new RequestError(
        ERROR_MESSAGE.COURSE_FORBIDDEN,
        STATUS_CODE.FORBIDDEN,
      );
    }
  }

  private async checkTitles(titles: string[]): Promise<void> {
    const duplicatedCourse =
      await this.courseRepository.findAllByTitles(titles);

    if (duplicatedCourse) {
      const duplicatedTitles: string[] = [ERROR_MESSAGE.COURSE_DUPLICATE_TITLE];
      duplicatedCourse.forEach((x) => duplicatedTitles.push(x.title));

      throw new RequestError(
        ERROR_MESSAGE.COURSE_DUPLICATE_TITLE,
        STATUS_CODE.BAD_REQUEST,
        duplicatedTitles,
      );
    }
  }
}
