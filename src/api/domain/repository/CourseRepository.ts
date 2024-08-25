import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { singleton } from 'tsyringe';

import { ERROR_CODE, ERROR_MESSAGE } from '@constant/ErrorConstant';
import { Course, CourseMysql } from '@entity/Course';
import SqlError from '@error/SqlError';
import Mysql from '@loader/Mysql';
import logger from '@util/logger';

@singleton()
export default class CourseRepository {
  private mysqlPool: Mysql;

  constructor(mysqlPool: Mysql) {
    this.mysqlPool = mysqlPool;
  }

  public async save(course: Course): Promise<number> {
    const connection = await this.mysqlPool.getConnection();

    try {
      const sql =
        'INSERT INTO course (instructor_id, title, description, price, category) VALUES (?, ?, ?, ?, ?)';
      const value = Object.values(course.itemsForSave);

      const [result] = await connection.execute<ResultSetHeader>(sql, value);

      return result.insertId;
    } catch (e) {
      throw new SqlError(
        ERROR_MESSAGE.SQL_WRITE_ERROR,
        ERROR_CODE.SERVER,
        e as Error,
      );
    } finally {
      connection.release();
    }
  }

  public async saveAll(courses: Course[]): Promise<number[]> {
    const connection = await this.mysqlPool.getConnection();

    try {
      await connection.beginTransaction();

      const sql =
        'INSERT INTO course (instructor_id, title, description, price, category) VALUES ?';
      const value = courses.map((x) => Object.values(x.itemsForSave));

      const [result] = await connection.query<ResultSetHeader>(sql, [value]);

      await connection.commit();

      const insertIds = Array.from(
        { length: result.affectedRows },
        (_, x) => result.insertId + x,
      );

      return insertIds;
    } catch (e) {
      logger.error(ERROR_MESSAGE.SQL_ROLLBACK);
      await connection.rollback();

      throw new SqlError(
        ERROR_MESSAGE.SQL_WRITE_ERROR,
        ERROR_CODE.SERVER,
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

      const [result] = await connection.execute<RowDataPacket[]>(sql, values);

      if (result.length === 0) return;

      const courseMysql = result[0] as CourseMysql;
      const course = Course.from(courseMysql);

      return course;
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

  public async update(course: Course): Promise<void> {
    const connection = await this.mysqlPool.getConnection();

    try {
      const sql =
        'UPDATE course SET title = ?, description = ?, price = ? WHERE id = ?';
      const value = Object.values(course.itemsForUpdate);

      const [result] = await connection.execute<ResultSetHeader>(sql, value);
    } catch (e) {
    } finally {
      connection.release();
    }
  }
}
