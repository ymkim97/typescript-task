import { RowDataPacket } from 'mysql2';

export class Instructor {
  constructor(
    private id: number,
    private name: string,
  ) {}

  public static from(instructorMysql: InstructorMysql): Instructor {
    return new Instructor(instructorMysql.id, instructorMysql.name);
  }
}

export interface InstructorMysql extends RowDataPacket {
  id: number;
  name: string;
}
