import { singleton } from 'tsyringe';

import { StudentAndClassMysql, StudentClass } from '@entity/StudentClass';
import Mysql from '@loader/Mysql';
import { executeReadQuery } from '@util/mysqlUtil';

@singleton()
export default class ClassRepository {
  private mysqlPool: Mysql;

  constructor(mysqlPool: Mysql) {
    this.mysqlPool = mysqlPool;
  }

  public async findWithStudentsByCourseId(id: number): Promise<StudentClass[]> {
    const connection = await this.mysqlPool.getConnection();

    return executeReadQuery(connection, async () => {
      const sql =
        'SELECT st.nickname, cl.create_date ' +
        'FROM student st LEFT JOIN class cl ON st.id = cl.student_id ' +
        'WHERE cl.course_id = ?;';
      const value = [id];

      const [result] = await connection.query<StudentAndClassMysql[]>(
        sql,
        value,
      );

      return result.map(StudentClass.from);
    });
  }
}
