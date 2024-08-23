import mysql, { PoolOptions } from 'mysql2/promise';
import { singleton } from 'tsyringe';

import config from '@config/';
import logger from '@util/logger';

@singleton()
export default class Mysql {
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

  public async getConnection() {
    try {
      const conn = await this.pool.getConnection();

      return conn;
    } catch (e) {
      logger.error('Get Connection Error');

      throw e;
    }
  }

  public async testConnection(): Promise<void> {
    try {
      const conn = await this.pool.getConnection();

      conn.release();
    } catch (e) {
      logger.error('Database Connection Test: FAIL', e);

      throw e;
    }
  }
}
