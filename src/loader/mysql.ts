import mysql, { PoolOptions } from 'mysql2/promise';
import { singleton } from 'tsyringe';

import config from '@config/';
import logger from '@util/logger';

@singleton()
class Mysql {
  private readonly pool: mysql.Pool;
  private readonly access: PoolOptions = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.db,
    waitForConnections: true,
    connectionLimit: 10,
    charset: config.mysql.charset,
  };

  constructor() {
    this.pool = mysql.createPool(this.access);
  }

  public get createdPool(): mysql.Pool {
    return this.pool;
  }

  public async testConnection(): Promise<void> {
    try {
      const con = await this.pool.getConnection();

      con.release();
    } catch (error) {
      logger.error('Database Connection Test: FAIL', error);

      throw error;
    }
  }
}

export default Mysql;
