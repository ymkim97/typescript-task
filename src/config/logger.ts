import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import process from 'process';
import config from '.';

const { combine, timestamp, label, printf } = winston.format;

const logDir = `${process.cwd()}/logs`;

const loggerInstance = winston.createLogger({
  level: config.log.level,

  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    label({ label: 'app' }),
    printf(
      ({ level, message, label, timestamp }) =>
        `${timestamp} [${label}] ${level}: ${message}`,
    ),
  ),

  transports: [
    new winstonDaily({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: `%DATE%.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),

    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/error`,
      filename: `%DATE%.error.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],

  exceptionHandlers: [
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir,
      filename: `%DATE%.exception.log`,
      maxFiles: 30,
      zippedArchive: true,
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  loggerInstance.add(new winston.transports.Console({}));
}

export default loggerInstance;
