import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { singleton } from 'tsyringe';

import { STATUS_CODE } from '@constant/StatusConstant';
import ApplyClassRequest from '@dto/request/ApplyClassRequest';
import SignUpStudentRequest from '@dto/request/SignUpStudentRequest';
import StudentService from '@service/StudentService';

@singleton()
export default class StudentController {
  constructor(readonly studentService: StudentService) {}

  public async signUpStudent(req: Request, res: Response): Promise<void> {
    const signUpRequest = plainToInstance(SignUpStudentRequest, req.body);
    const studentId = await this.studentService.signUp(signUpRequest);

    res.status(STATUS_CODE.CREATED).json({ signUpId: studentId });
  }

  public async withdrawStudent(req: Request, res: Response): Promise<void> {
    const studentId = parseInt(req.params.id, 10);
    const withdrawId = await this.studentService.withdraw(studentId);

    res.status(STATUS_CODE.OK).json({ removedStudentId: withdrawId });
  }

  public async applyClass(req: Request, res: Response): Promise<void> {
    const applyClassRequest = plainToInstance(ApplyClassRequest, req.body);

    const applyClassResponse =
      await this.studentService.applyClass(applyClassRequest);

    const statusCode =
      applyClassResponse.createdClassIds.length > 0
        ? STATUS_CODE.CREATED
        : STATUS_CODE.OK;

    res.status(statusCode).send(instanceToPlain(applyClassResponse));
  }
}
