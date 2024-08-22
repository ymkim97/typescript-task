export interface StudentAndClassMysql {
  nickname: string;
  create_date: Date;
}

export interface StudentAndClass {
  nickname: string;
  joinedOn: Date;
}

export function mapToStudentAndClass(
  studentAndClassMysql: StudentAndClassMysql,
): StudentAndClass {
  return {
    nickname: studentAndClassMysql.nickname,
    joinedOn: studentAndClassMysql.create_date,
  };
}
