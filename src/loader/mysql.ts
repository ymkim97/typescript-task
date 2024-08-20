import mysql, { PoolOptions } from 'mysql2/promise';

import config from '@config/';
import logger from '@config/logger';

let pool: mysql.Pool;

const access: PoolOptions = {
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.db,
  waitForConnections: true,
  connectionLimit: 10,
};

async function testConnection(): Promise<void> {
  try {
    const con = await pool.getConnection();

    con.release();
  } catch (error) {
    logger.error('Database Connection Test: FAIL', error);

    throw error;
  }
}

export default async (): Promise<mysql.Pool> => {
  if (!pool) {
    pool = mysql.createPool(access);

    await testConnection();
  }

  return pool;
};
