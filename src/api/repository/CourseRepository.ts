import { singleton } from 'tsyringe';

import Mysql from '@loader/Mysql';
import logger from '@util/logger';
import NotFoundError from '@error/NotFoundError';
import { Course, CourseMysql, mapToCourse } from '@type/CourseType';

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
      const course = mapToCourse(result);

      return course;
    } catch (e) {
      logger.info(e);

      throw new NotFoundError(NotFoundError.DATA_NOT_FOUND, 404);
    } finally {
      connection.release();
    }
  }
}

// transaction
// try {
//   await connection.beginTransaction();
//   const res = await connection.execute('SELECT * FROM instructor');

//   console.log(res[0]);
//   await connection.commit();
// } catch (e) {
//   logger.error('Rollback Connection', e);
//   await connection.rollback();

//   throw e;
// } finally {
//   connection.release();
// }
