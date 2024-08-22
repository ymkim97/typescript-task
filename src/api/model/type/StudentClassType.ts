import { changeDateToString } from '@util/dateFormatter';

export interface StudentAndClassMysql {
  nickname: string;
  create_date: Date;
}

export interface StudentAndClass {
  nickname: string;
  joinedOn: string;
}

export function mapToStudentAndClass(
  studentAndClassMysql: StudentAndClassMysql,
): StudentAndClass {
  return {
    nickname: studentAndClassMysql.nickname,
    joinedOn: changeDateToString(studentAndClassMysql.create_date),
  };
}
