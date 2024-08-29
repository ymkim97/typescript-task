import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { singleton } from 'tsyringe';

import { StudentAndClassMysql, StudentClass } from '@entity/StudentClass';
import Mysql from '@loader/Mysql';
import { executeQuery, executeQueryTransaction } from '@util/mysqlUtil';

@singleton()
export default class ClassRepository {
  constructor(private readonly mysqlPool: Mysql) {}

  public async findAllCourseIdsByStudentId(
    id: number,
    prevConnection?: PoolConnection,
  ): Promise<number[]> {
    const sql = 'SELECT course_id FROM class WHERE student_id = ?;';
    const value = [id];

    if (!prevConnection) {
      const connection = await this.mysqlPool.getConnection();

      return await executeQuery(connection, async () => {
        const [result] = await connection.query<RowDataPacket[]>(sql, value);

        return Object.values(result.map((x) => x.course_id as number));
      });
    } else {
      const [result] = await prevConnection.query<RowDataPacket[]>(sql, value);

      return Object.values(result.map((x) => x.course_id as number));
    }
  }

  public async saveAllByStudentIdAndCourseIds(
    studentId: number,
    courseIds: number[],
    prevConnection?: PoolConnection,
  ): Promise<number[]> {
    const sql = 'INSERT INTO class (student_id, course_id) VALUES ?;';
    const value = courseIds.map((courseId) => [studentId, courseId]);

    if (!prevConnection) {
      const connection = await this.mysqlPool.getConnection();

      return await executeQueryTransaction(connection, async () => {
        const [result] = await connection.query<ResultSetHeader>(sql, [value]);

        const insertIds = Array.from(
          { length: result.affectedRows },
          (_, x) => result.insertId + x,
        );

        return insertIds;
      });
    } else {
      const [result] = await prevConnection.query<ResultSetHeader>(sql, [
        value,
      ]);

      const insertIds = Array.from(
        { length: result.affectedRows },
        (_, x) => result.insertId + x,
      );

      return insertIds;
    }
  }

  public async findAllWithStudentsByCourseId(
    id: number,
  ): Promise<StudentClass[]> {
    const connection = await this.mysqlPool.getConnection();

    return await executeQuery(connection, async () => {
      const sql =
        'SELECT st.nickname, cl.create_date ' +
        'FROM student st JOIN class cl ON st.id = cl.student_id ' +
        'WHERE cl.course_id = ?;';
      const value = [id];

      const [result] = await connection.query<StudentAndClassMysql[]>(
        sql,
        value,
      );

      return result.map(StudentClass.from);
    });
  }

  public async deleteAllByStudentId(
    id: number,
    prevConnection?: PoolConnection,
  ): Promise<void> {
    const sql = 'DELETE FROM class WHERE id = ?;';
    const value = [id];

    if (!prevConnection) {
      const connection = await this.mysqlPool.getConnection();

      return await executeQuery(connection, async () => {
        await connection.query<ResultSetHeader>(sql, value);
      });
    } else {
      await prevConnection.query<ResultSetHeader>(sql, value);
    }
  }
}
