import { changeDateToString } from '@util/dateFormatter';

export class StudentClass {
  private nickname: string;
  private joinedOn: string;

  constructor(nickname: string, joinedOn: Date) {
    this.nickname = nickname;
    this.joinedOn = changeDateToString(joinedOn);
  }

  public static from(studentAndClassMysql: StudentAndClassMysql): StudentClass {
    return new StudentClass(
      studentAndClassMysql.nickname,
      studentAndClassMysql.create_date,
    );
  }
}

export interface StudentAndClassMysql {
  nickname: string;
  create_date: Date;
}
