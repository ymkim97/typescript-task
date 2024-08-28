import { RowDataPacket } from 'mysql2';

export class StudentClass {
  readonly nickname: string;
  readonly appliedOn: Date;

  constructor(nickname: string, appliedOn: Date) {
    this.nickname = nickname;
    this.appliedOn = appliedOn;
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
