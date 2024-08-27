import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { singleton } from 'tsyringe';

import { STATUS_CODE } from '@constant/StatusConstant';
import SignUpStudentRequest from '@dto/request/SignUpStudentRequest';
import StudentService from '@service/StudentService';

@singleton()
export default class StudentController {
  private studentService: StudentService;

  constructor(studentService: StudentService) {
    this.studentService = studentService;
  }

  public async signUpStudent(req: Request, res: Response): Promise<void> {
    const signUpRequest = plainToInstance(SignUpStudentRequest, req.body);
    const studentId = await this.studentService.signUp(signUpRequest);

    res
      .status(STATUS_CODE.CREATED)
      .send(JSON.stringify({ signUpId: studentId }));
  }

  public async withdrawStudent(req: Request, res: Response): Promise<void> {
    const studentId = parseInt(req.params.id, 10);
    const withdrawId = await this.studentService.withdraw(studentId);

    res
      .status(STATUS_CODE.OK)
      .send(JSON.stringify({ removedStudentId: withdrawId }));
  }
}
