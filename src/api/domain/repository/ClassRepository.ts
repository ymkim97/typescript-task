import { singleton } from 'tsyringe';

import Mysql from '@loader/Mysql';
import logger from '@util/logger';
import { ERROR_CODE, ERROR_MESSAGE } from '@constant/ErrorConstant';
import NotFoundError from '@error/NotFoundError';
import { StudentClass, StudentAndClassMysql } from '@entity/StudentClass';

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

      throw new NotFoundError(
        ERROR_MESSAGE.DATA_NOT_FOUND,
        ERROR_CODE.NOT_FOUND_ERROR,
      );
    } finally {
      connection.release();
    }
  }
}
