import dotenv from 'dotenv';
import path from 'path';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

let env: dotenv.DotenvConfigOutput;

if (process.env.IS_TEST) {
  env = dotenv.config({ path: path.join(__dirname, '../../../.env.test') });
} else env = dotenv.config({ path: path.join(__dirname, '../../../.env') });

if (!env) throw new Error('No .env file found.');

export default {
  nodeEnv: process.env.NODE_ENV,

  serverPort: process.env.PORT,

  log: {
    level: process.env.LOG_LEVEL || 'info',
  },

  mysql: {
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    db: process.env.MYSQL_DB,
    host: process.env.IS_DOCKER || process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT || '3306',
    charset: process.env.MYSQL_CHARSET,
  },
};
