import { singleton } from 'tsyringe';

import Mysql from '@loader/Mysql';
import logger from '@util/logger';
import NotFoundError from '@error/NotFoundError';
import { Course, CourseMysql } from '@entity/Course';
import { ERROR_CODE, ERROR_MESSAGE } from '@constant/ErrorConstant';

@singleton()
export default class CourseRepository {
  private mysqlPool: Mysql;

  constructor(mysqlPool: Mysql) {
    this.mysqlPool = mysqlPool;
  }

  public async findById(id: number): Promise<Course> {
    const connection = await this.mysqlPool.getConnection();

    try {
      const sql = 'SELECT * FROM course WHERE id = ?;';
      const values = [id];

      const [rows] = await connection.execute(sql, values);
      const result = rows[0] as CourseMysql;
      const course = Course.from(result);

      return course;
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
