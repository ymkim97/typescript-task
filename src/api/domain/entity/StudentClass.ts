import { RowDataPacket } from 'mysql2';

export class StudentClass {
  readonly nickname: string;
  readonly createDate: Date;

  constructor(nickname: string, createDate: Date) {
    this.nickname = nickname;
    this.createDate = createDate;
  }

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
