import { singleton } from 'tsyringe';

import { Instructor, InstructorMysql } from '@dto/entity/Instructor';
import Mysql from '@loader/Mysql';
import { executeQuery } from '@util/mysqlUtil';

@singleton()
export default class InstructorRepository {
  constructor(private readonly mysqlPool: Mysql) {}

  public async findById(id: number): Promise<Instructor | void> {
    const connection = await this.mysqlPool.getConnection();

    return await executeQuery(connection, async () => {
      const sql = 'SELECT * FROM instructor WHERE id = ?;';
      const value = [id];

      const [result] = await connection.query<InstructorMysql[]>(sql, value);
      if (result.length === 0) return;

      return Instructor.from(result[0]);
    });
  }
}
