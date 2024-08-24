import { singleton } from 'tsyringe';

import Mysql from '@loader/Mysql';
import SqlError from '@error/SqlError';
import { ERROR_CODE, ERROR_MESSAGE } from '@constant/ErrorConstant';
import { StudentClass, StudentAndClassMysql } from '@entity/StudentClass';

@singleton()
export default class ClassRepository {
  private mysqlPool: Mysql;

  constructor(mysqlPool: Mysql) {
    this.mysqlPool = mysqlPool;
  }

  public async findWithStudentsByCourseId(id: number): Promise<StudentClass[]> {
    const connection = await this.mysqlPool.getConnection();

    try {
      const sql =
        'SELECT st.nickname, cl.create_date ' +
        'FROM student st LEFT JOIN class cl ON st.id = cl.student_id ' +
        'WHERE cl.course_id = ?;';
      const values = [id];

      const [rows] = await connection.execute(sql, values);
      const results = rows as StudentAndClassMysql[];

      return results.map(StudentClass.from);
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
