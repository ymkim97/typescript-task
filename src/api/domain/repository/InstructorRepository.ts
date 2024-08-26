import { singleton } from 'tsyringe';

import { Instructor, InstructorMysql } from '@entity/Instructor';
import Mysql from '@loader/Mysql';
import { executeReadQuery } from '@util/mysqlUtil';

@singleton()
export default class InstructorRepository {
  private mysqlPool: Mysql;

  constructor(mysqlPool: Mysql) {
    this.mysqlPool = mysqlPool;
  }

  public async findById(id: number): Promise<Instructor | void> {
    const connection = await this.mysqlPool.getConnection();

    return await executeReadQuery(connection, async () => {
      const sql = 'SELECT * FROM instructor WHERE id = ?;';
      const value = [id];

      const [result] = await connection.query<InstructorMysql[]>(sql, value);

      if (result.length === 0) return;

      return Instructor.from(result[0]);
    });
  }
}
