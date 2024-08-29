import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { singleton } from 'tsyringe';

import { STATUS_CODE } from '@constant/StatusConstant';
import CreateBulkCourseRequest from '@dto/request/CreateBulkCourseRequest';
import CreateCourseRequest from '@dto/request/CreateCourseRequest';
import DeleteCourseRequest from '@dto/request/DeleteCourseRequest';
import OpenCourseRequest from '@dto/request/OpenCourseRequest';
import UpdateCourseRequest from '@dto/request/UpdateCourseRequest';
import CourseService from '@service/CourseService';
import SearchService from '@service/SearchService';

@singleton()
export default class CourseController {
  constructor(
    readonly courseService: CourseService,
    readonly searchService: SearchService,
  ) {}

  // /search?type=instructorAndTitle&keyword=abc&category=all&pageNumber=1&pageSize=10&sort=recent
  // /search?type=studentId&keyword=3&category=web&pageNumber=2&pageSize=10&sort=student-count
  public async searchCourses(req: Request, res: Response): Promise<void> {
    const type = req.query.type as string;
    const keyword = req.query.keyword as string;
    const category = req.query.category as string;
    const pageNumber = parseInt(req.query.pageNumber as string, 10);
    const pageSize = parseInt(req.query.pageSize as string, 10);
    const sort = req.query.sort as string;

    const courseListResponses = await this.searchService.searchCourseByKeyword(
      type,
      keyword,
      category,
      pageNumber,
      pageSize,
      sort,
    );

    res.status(STATUS_CODE.OK).send(instanceToPlain(courseListResponses));
  }

  public async searchCourse(req: Request, res: Response): Promise<void> {
    const courseId = parseInt(req.params.id, 10);
    const courseDetailsResponse =
      await this.searchService.getCourseDetails(courseId);

    res
      .status(STATUS_CODE.OK)
      .send(instanceToPlain(courseDetailsResponse) || {});
  }

  public async registerCourse(req: Request, res: Response): Promise<void> {
    const createCourseRequest = plainToInstance(CreateCourseRequest, req.body);
    const createdCourseId =
      await this.courseService.registerNew(createCourseRequest);

    res.status(STATUS_CODE.CREATED).json({ insertedCourseId: createdCourseId });
  }

  public async registerBulkCourse(req: Request, res: Response): Promise<void> {
    const createBulkCourseRequest = plainToInstance(
      CreateBulkCourseRequest,
      req.body,
    );
    const createdCourseIds = await this.courseService.registerNewBulk(
      createBulkCourseRequest,
    );

    res
      .status(STATUS_CODE.CREATED)
      .json({ insertedCourseIds: createdCourseIds });
  }

  public async updateCourse(req: Request, res: Response): Promise<void> {
    const courseId = parseInt(req.params.id, 10);
    const updateCourseRequest = plainToInstance(UpdateCourseRequest, req.body);

    await this.courseService.update(courseId, updateCourseRequest);

    res.status(STATUS_CODE.OK).json({ updatedCourseId: courseId });
  }

  public async openCourse(req: Request, res: Response): Promise<void> {
    const courseId = parseInt(req.params.id, 10);
    const openCourseRequest = plainToInstance(OpenCourseRequest, req.body);

    await this.courseService.open(courseId, openCourseRequest);

    res.status(STATUS_CODE.OK).json({ openedCourseId: courseId });
  }

  public async deleteCourse(req: Request, res: Response): Promise<void> {
    const courseId = parseInt(req.params.id, 10);
    const deleteCourseRequest = plainToInstance(DeleteCourseRequest, req.body);

    await this.courseService.delete(courseId, deleteCourseRequest);

    res.status(STATUS_CODE.OK).json({ deletedCourseId: courseId });
  }
}
