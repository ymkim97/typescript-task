import { PoolConnection, ResultSetHeader } from 'mysql2/promise';
import { singleton } from 'tsyringe';

import { Student, StudentMysql } from '@entity/Student';
import Mysql from '@loader/Mysql';
import { executeQuery, executeQueryTransaction } from '@util/mysqlUtil';

@singleton()
export default class StudentRepository {
  private mysqlPool: Mysql;

  constructor(mysqlPool: Mysql) {
    this.mysqlPool = mysqlPool;
  }

  public async save(student: Student): Promise<number> {
    const connection = await this.mysqlPool.getConnection();

    return await executeQueryTransaction(connection, async () => {
      const sql = 'INSERT INTO student (email, nickname) VALUES (?, ?);';
      const value = Object.values(student.itemsForSave);

      const [result] = await connection.query<ResultSetHeader>(sql, value);

      return result.insertId;
    });
  }

  public async findById(
    id: number,
    connection?: PoolConnection,
  ): Promise<Student | void> {
    if (!connection) connection = await this.mysqlPool.getConnection();

    return await executeQuery(connection, async () => {
      const sql = 'SELECT * FROM student WHERE id = ?;';
      const value = [id];

      const [result] = await connection.query<StudentMysql[]>(sql, value);
      if (result.length === 0) return;

      return Student.from(result[0]);
    });
  }

  public async delete(
    student: Student,
    prevConnection?: PoolConnection,
  ): Promise<void> {
    const sql = 'DELETE FROM student WHERE id = ?';
    const value = [student.id];

    if (!prevConnection) {
      const connection = await this.mysqlPool.getConnection();

      return await executeQuery(connection, async () => {
        await connection.query<ResultSetHeader>(sql, value);
      });
    } else {
      return await executeQuery(prevConnection, async () => {
        await prevConnection.query<ResultSetHeader>(sql, value);
      });
    }
  }
}
