import { PoolConnection, ResultSetHeader } from 'mysql2/promise';
import { singleton } from 'tsyringe';

import { StudentAndClassMysql, StudentClass } from '@entity/StudentClass';
import Mysql from '@loader/Mysql';
import { executeQuery } from '@util/mysqlUtil';

@singleton()
export default class ClassRepository {
  private mysqlPool: Mysql;

  constructor(mysqlPool: Mysql) {
    this.mysqlPool = mysqlPool;
  }

  public async findAllWithStudentsByCourseId(
    id: number,
  ): Promise<StudentClass[]> {
    const connection = await this.mysqlPool.getConnection();

    return await executeQuery(connection, async () => {
      const sql =
        'SELECT st.nickname, cl.create_date ' +
        'FROM student st LEFT JOIN class cl ON st.id = cl.student_id ' +
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
      return await executeQuery(prevConnection, async () => {
        await prevConnection.query<ResultSetHeader>(sql, value);
      });
    }
  }
}
