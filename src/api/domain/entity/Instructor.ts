import { RowDataPacket } from 'mysql2';

export class Instructor {
  private id: number;
  private name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  public static from(instructorMysql: InstructorMysql): Instructor {
    return new Instructor(instructorMysql.id, instructorMysql.name);
  }
}

export interface InstructorMysql extends RowDataPacket {
  id: number;
  name: string;
}
