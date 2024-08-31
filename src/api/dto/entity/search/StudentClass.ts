import { RowDataPacket } from 'mysql2';

export class StudentClass {
  constructor(
    readonly nickname: string,
    readonly appliedOn: Date,
  ) {}

  public static from(studentAndClassMysql: StudentAndClassMysql): StudentClass {
    return new StudentClass(
      studentAndClassMysql.nickname,
      studentAndClassMysql.create_date,
    );
  }
}

export interface StudentAndClassMysql extends RowDataPacket {
  nickname: string;
  create_date: Date;
}
