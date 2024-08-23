import { singleton } from 'tsyringe';

import { StudentClass, StudentAndClassMysql } from '@entity/StudentClass';
import NotFoundError from '@error/NotFoundError';
import Mysql from '@loader/Mysql';
import logger from '@util/logger';

@singleton()
export default class ClassRepository {
  private mysqlPool: Mysql;

  constructor(mysqlPool: Mysql) {
    this.mysqlPool = mysqlPool;
  }

  public async findWithStudentByCourseId(id: number): Promise<StudentClass[]> {
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
      logger.info(e);

      throw new NotFoundError(NotFoundError.DATA_NOT_FOUND, 404);
    } finally {
      connection.release();
    }
  }
}
