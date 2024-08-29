import { container } from 'tsyringe';

import CourseController from '@controller/CourseController';
import StudentController from '@controller/StudentController';
import logger from '@util/logger';
import Mysql from './Mysql';

export default async function initContainer() {
  const mysqlPool = container.resolve(Mysql);
  logger.info('Create Mysql Connection Pool: OK');

  container.registerSingleton(CourseController);
  container.registerSingleton(StudentController);
}
