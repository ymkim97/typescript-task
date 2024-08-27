import { ResultSetHeader } from 'mysql2/promise';
import { singleton } from 'tsyringe';

import { Course, CourseMysql } from '@entity/Course';
import Mysql from '@loader/Mysql';
import { executeQuery, executeQueryTransaction } from '@util/mysqlUtil';

@singleton()
export default class CourseRepository {
  private mysqlPool: Mysql;

  constructor(mysqlPool: Mysql) {
    this.mysqlPool = mysqlPool;
  }

  public async save(course: Course): Promise<number> {
    const connection = await this.mysqlPool.getConnection();

    return await executeQueryTransaction(connection, async () => {
      const sql =
        'INSERT INTO course (instructor_id, title, description, price, category) VALUES (?, ?, ?, ?, ?)';
      const value = Object.values(course.itemsForSave);

      const [result] = await connection.execute<ResultSetHeader>(sql, value);

      return result.insertId;
    });
  }

  public async saveAll(courses: Course[]): Promise<number[]> {
    const connection = await this.mysqlPool.getConnection();

    return await executeQueryTransaction(connection, async () => {
      const sql =
        'INSERT INTO course (instructor_id, title, description, price, category) VALUES ?';
      const value = courses.map((x) => Object.values(x.itemsForSave));

      const [result] = await connection.query<ResultSetHeader>(sql, [value]);

      const insertIds = Array.from(
        { length: result.affectedRows },
        (_, x) => result.insertId + x,
      );

      return insertIds;
    });
  }

  public async findById(id: number): Promise<Course | void> {
    const connection = await this.mysqlPool.getConnection();

    return await executeQuery(connection, async () => {
      const sql = 'SELECT * FROM course WHERE id = ?;';
      const value = [id];

      const [result] = await connection.query<CourseMysql[]>(sql, value);
      if (result.length === 0) return;

      return Course.from(result[0]);
    });
  }

  public async findAllByTitles(titles: string[]): Promise<Course[] | void> {
    const connection = await this.mysqlPool.getConnection();

    return await executeQuery(connection, async () => {
      const sql = 'SELECT * FROM course WHERE title IN (?);';
      const value = Object.values(titles);

      const [result] = await connection.query<CourseMysql[]>(sql, [value]);
      if (result.length === 0) return;

      return result.map((x) => Course.from(x));
    });
  }

  public async update(course: Course): Promise<void> {
    const connection = await this.mysqlPool.getConnection();

    return await executeQueryTransaction(connection, async () => {
      const sql =
        'UPDATE course SET title = ?, description = ?, price = ? WHERE id = ?;';
      const value = Object.values(course.itemsForUpdate);

      await connection.query<ResultSetHeader>(sql, value);
    });
  }

  public async updatePublic(course: Course): Promise<void> {
    const connection = await this.mysqlPool.getConnection();

    return await executeQueryTransaction(connection, async () => {
      const sql = 'UPDATE course SET is_public = true WHERE id = ?';
      const value = [course.id];

      await connection.query<ResultSetHeader>(sql, value);
    });
  }

  public async delete(course: Course): Promise<void> {
    const connection = await this.mysqlPool.getConnection();

    return await executeQueryTransaction(connection, async () => {
      const sql = 'DELETE FROM course WHERE id = ?';
      const value = [course.id];

      await connection.query<ResultSetHeader>(sql, value);
    });
  }
}
