import { singleton } from 'tsyringe';

import Mysql from '@loader/Mysql';

@singleton()
export default class StudentRepository {
  private mysqlPool: Mysql;

  constructor(mysqlPool: Mysql) {
    this.mysqlPool = mysqlPool;
  }
}
