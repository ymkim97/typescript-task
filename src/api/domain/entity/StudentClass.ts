import { RowDataPacket } from 'mysql2';

export class StudentClass {
  private nickname: string;
  private createDate: Date;

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
