import { singleton } from 'tsyringe';

import { ERROR_CODE, ERROR_MESSAGE } from '@constant/ErrorConstant';
import { Instructor, InstructorMysql } from '@entity/Instructor';
import SqlError from '@error/SqlError';
import Mysql from '@loader/Mysql';

@singleton()
export default class InstructorRepository {
  private mysqlPool: Mysql;

  constructor(mysqlPool: Mysql) {
    this.mysqlPool = mysqlPool;
  }

  // public async save(instructor: Instructor): Promise<number | void> {

  // }

  public async findById(id: number): Promise<Instructor | void> {
    const connection = await this.mysqlPool.getConnection();

    try {
      const sql = 'SELECT * FROM instructor WHERE id = ?;';
      const values = [id];

      const [rows] = await connection.execute(sql, values);

      if (!rows[0]) return;

      const result = rows[0] as InstructorMysql;
      const instructor = Instructor.from(result);

      return instructor;
    } catch (e) {
      throw new SqlError(
        ERROR_MESSAGE.SQL_READ_ERROR,
        ERROR_CODE.SERVER_ERROR,
        e as Error,
      );
    } finally {
      connection.release();
    }
  }
}
