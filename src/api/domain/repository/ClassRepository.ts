import { RowDataPacket } from 'mysql2';
import { singleton } from 'tsyringe';

import { ERROR_CODE, ERROR_MESSAGE } from '@constant/ErrorConstant';
import { StudentAndClassMysql, StudentClass } from '@entity/StudentClass';
import SqlError from '@error/SqlError';
import Mysql from '@loader/Mysql';

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

      const [result] = await connection.execute<RowDataPacket[]>(sql, values);
      const withStudents = result as StudentAndClassMysql[];

      return withStudents.map(StudentClass.from);
    } catch (e) {
      throw new SqlError(
        ERROR_MESSAGE.SQL_READ_ERROR,
        ERROR_CODE.SERVER,
        e as Error,
      );
    } finally {
      connection.release();
    }
  }
}
