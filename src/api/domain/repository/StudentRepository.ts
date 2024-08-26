import { singleton } from 'tsyringe';

import { Student } from '@entity/Student';
import Mysql from '@loader/Mysql';
import { executeWriteQuery } from '@util/mysqlUtil';
import { ResultSetHeader } from 'mysql2';

@singleton()
export default class StudentRepository {
  private mysqlPool: Mysql;

  constructor(mysqlPool: Mysql) {
    this.mysqlPool = mysqlPool;
  }

  public async save(student: Student): Promise<number> {
    const connection = await this.mysqlPool.getConnection();

    return await executeWriteQuery(connection, async () => {
      const sql = 'INSERT INTO student (email, nickname) VALUES (?, ?)';
      const value = Object.values(student.itemsForSave);

      const [result] = await connection.execute<ResultSetHeader>(sql, value);

      return result.insertId;
    });
  }
}
