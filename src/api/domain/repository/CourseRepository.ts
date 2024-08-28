import { PoolConnection, ResultSetHeader } from 'mysql2/promise';
import { singleton } from 'tsyringe';

import { Course, CourseMysql } from '@entity/Course';
import { CourseClass, CourseClassMysql } from '@entity/CourseClass';
import { CourseSearch, CourseSearchMysql } from '@entity/CourseSearch';
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
        'INSERT INTO course (instructor_id, title, description, price, category) VALUES (?, ?, ?, ?, ?);';
      const value = Object.values(course.itemsForSave);

      const [result] = await connection.execute<ResultSetHeader>(sql, value);

      return result.insertId;
    });
  }

  public async saveAll(courses: Course[]): Promise<number[]> {
    const connection = await this.mysqlPool.getConnection();

    return await executeQueryTransaction(connection, async () => {
      const sql =
        'INSERT INTO course (instructor_id, title, description, price, category) VALUES ?;';
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
      const value = id;

      const [result] = await connection.query<CourseMysql[]>(sql, value);
      if (result.length === 0) return;

      return Course.from(result[0]);
    });
  }

  public async findAllWithClassByStudentIdAndCourseIds(
    studentId: number,
    courseIds: number[],
  ): Promise<CourseClass[]> {
    const connection = await this.mysqlPool.getConnection();

    return await executeQuery(connection, async () => {
      const sql =
        'SELECT c.id AS course_id, c.is_public, cl.student_id ' +
        'FROM course c LEFT JOIN class cl ON c.id = cl.course_id AND cl.student_id = ? ' +
        'WHERE c.id IN (?);';
      const value = [studentId, courseIds];

      const [result] = await connection.query<CourseClassMysql[]>(sql, value);

      return result.map(CourseClass.from);
    });
  }

  public async findAllByTitles(titles: string[]): Promise<Course[] | void> {
    const connection = await this.mysqlPool.getConnection();

    return await executeQuery(connection, async () => {
      const sql = 'SELECT * FROM course WHERE title IN (?);';
      const value = Object.values(titles);

      const [result] = await connection.query<CourseMysql[]>(sql, [value]);
      if (result.length === 0) return;

      return result.map(Course.from);
    });
  }

  public async findAllByKeyword(
    type: string,
    keyword: string,
    category: string | null,
    startIndex: number,
    pageSize: number,
    sort: string,
  ): Promise<CourseSearch[]> {
    const connection = await this.mysqlPool.getConnection();
    let value: object;
    let sql: string;

    if (category === 'ALL') category = null;

    if (type === 'instructorAndTitle') {
      value = [
        category,
        category,
        `%${keyword}%`,
        `%${keyword}%`,
        false,
        null,
        startIndex,
        pageSize,
      ];
    } else if (type === 'studentId') {
      value = [
        category,
        category,
        null,
        null,
        true,
        parseInt(keyword, 10),
        startIndex,
        pageSize,
      ];
    }

    if (sort === 'recent') {
      return await executeQuery(connection, async () => {
        sql =
          'SELECT co.id AS course_id, co.category, co.title, ins.name AS instructor_name, co.price, co.student_count, co.create_date ' +
          'FROM course co JOIN instructor ins ON co.instructor_id = ins.id LEFT JOIN class cl ON cl.course_id = co.id ' +
          'WHERE (co.is_public = TRUE) AND (category = ? OR ? IS NULL) AND (co.title LIKE ? OR ins.name LIKE ? OR IF(?, cl.student_id = ?, NULL)) ' +
          'GROUP BY co.create_date, co.title, co.instructor_id, co.price, co.category, co.student_count, co.id, co.is_public ' +
          'ORDER BY co.create_date DESC, co.title, co.instructor_id, co.price, co.category, co.student_count, co.id, co.is_public ' +
          'LIMIT ?, ?';

        const [searchResults] = await connection.query<CourseSearchMysql[]>(
          sql,
          value,
        );

        return searchResults.map(CourseSearch.from);
      });
    } else {
      return await executeQuery(connection, async () => {
        sql =
          'SELECT co.id AS course_id, co.category, co.title, ins.name AS instructor_name, co.price, co.student_count, co.create_date ' +
          'FROM course co JOIN instructor ins ON co.instructor_id = ins.id LEFT JOIN class cl ON cl.course_id = co.id ' +
          'WHERE (co.is_public = TRUE) AND (category = ? OR ? IS NULL) AND (co.title LIKE ? OR ins.name LIKE ? OR IF(?, cl.student_id = ?, NULL)) ' +
          'GROUP BY co.student_count, co.create_date, co.title, co.instructor_id, co.price, co.category, co.id, co.is_public ' +
          'ORDER BY co.student_count DESC, co.create_date, co.title, co.instructor_id, co.price, co.category, co.id, co.is_public ' +
          'LIMIT ?, ?;';

        const [searchResults] = await connection.query<CourseSearchMysql[]>(
          sql,
          value,
        );

        return searchResults.map(CourseSearch.from);
      });
    }
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
      const sql = 'UPDATE course SET is_public = true WHERE id = ?;';
      const value = [course.id];

      await connection.query<ResultSetHeader>(sql, value);
    });
  }

  public async updateStudentCountByIds(
    ids: number[],
    prevConnection?: PoolConnection,
  ): Promise<void> {
    const sql =
      'UPDATE course SET student_count = student_count + 1 WHERE id IN (?);';
    const value = Object.values(ids);

    if (!prevConnection) {
      const connection = await this.mysqlPool.getConnection();

      return await executeQueryTransaction(connection, async () => {
        await connection.query<ResultSetHeader>(sql, [value]);
      });
    } else {
      await prevConnection.query<ResultSetHeader>(sql, [value]);
    }
  }

  public async delete(course: Course): Promise<void> {
    const connection = await this.mysqlPool.getConnection();

    return await executeQuery(connection, async () => {
      const sql = 'DELETE FROM course WHERE id = ?;';
      const value = [course.id];

      await connection.query<ResultSetHeader>(sql, value);
    });
  }
}
