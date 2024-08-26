export class Student {
  private id?: number;
  private email: string;
  private nickname: string;

  constructor(email: string, nickname: string, id?: number) {
    this.id = id;
    this.email = email;
    this.nickname = nickname;
  }

  public get itemsForSave() {
    return {
      email: this.email,
      nickname: this.nickname,
    };
  }

  public static from(studentMysql: StudentMysql) {
    return new Student(
      studentMysql.email,
      studentMysql.nickname,
      studentMysql.id,
    );
  }
}

export interface StudentMysql {
  id: number;
  email: string;
  nickname: string;
}
