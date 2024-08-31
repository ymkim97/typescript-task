import { RowDataPacket } from 'mysql2';

export class Student {
  constructor(
    private email: string,
    private nickname: string,
    private _id?: number,
  ) {}

  public get itemsForSave() {
    return {
      email: this.email,
      nickname: this.nickname,
    };
  }

  public get id() {
    return this._id;
  }

  public static from(studentMysql: StudentMysql) {
    return new Student(
      studentMysql.email,
      studentMysql.nickname,
      studentMysql.id,
    );
  }
}

export interface StudentMysql extends RowDataPacket {
  id: number;
  email: string;
  nickname: string;
}
