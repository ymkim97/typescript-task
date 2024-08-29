import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const env = dotenv.config();
if (env.error) throw new Error('No .env file found.');

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
    port: process.env.MYSQL_PORT,
    charset: process.env.MYSQL_CHARSET,
  },
};
