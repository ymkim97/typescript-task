import { RowDataPacket } from 'mysql2';

export class Student {
  private _id?: number;
  private email: string;
  private nickname: string;

  constructor(email: string, nickname: string, id?: number) {
    this._id = id;
    this.email = email;
    this.nickname = nickname;
  }

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
