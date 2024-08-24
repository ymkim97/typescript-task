import { singleton } from 'tsyringe';

import Mysql from '@loader/Mysql';
import SqlError from '@error/SqlError';
import { ResultSetHeader } from 'mysql2';
import { Course, CourseMysql } from '@entity/Course';
import { ERROR_CODE, ERROR_MESSAGE } from '@constant/ErrorConstant';

@singleton()
export default class CourseRepository {
  private mysqlPool: Mysql;

  constructor(mysqlPool: Mysql) {
    this.mysqlPool = mysqlPool;
  }

  public async save(course: Course): Promise<number | void> {
    const connection = await this.mysqlPool.getConnection();
    const items = course.itemsForSave;

    try {
      const sql =
        'INSERT INTO course (instructor_id, title, description, price, category) VALUES (?, ?, ?, ?, ?)';
      const value = [
        items.instructorId,
        items.title,
        items.description,
        items.price,
        items.category,
      ];

      const [result] = (await connection.execute(sql, value)) as [
        ResultSetHeader,
        any,
      ];

      return result.insertId;
    } catch (e) {
      throw new SqlError(
        ERROR_MESSAGE.SQL_WRITE_ERROR,
        ERROR_CODE.SERVER_ERROR,
        e as Error,
      );
    } finally {
      connection.release();
    }
  }

  public async findById(id: number): Promise<Course | void> {
    const connection = await this.mysqlPool.getConnection();

    try {
      const sql = 'SELECT * FROM course WHERE id = ?;';
      const values = [id];

      const [rows] = await connection.execute(sql, values);

      if (!rows[0]) return;

      const result = rows[0] as CourseMysql;
      const course = Course.from(result);

      return course;
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
