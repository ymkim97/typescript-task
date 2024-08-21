import { Application } from 'express';

import expressLoader from './express';
import mysqlLoader from './mysql';
import depencyInjector from './depencyInjector';

import logger from '@config/logger';

export default async (expressApp: Application): Promise<void> => {
  const mysqlPool = await mysqlLoader();
  logger.info('Create Mysql Connection Pool: OK');

  depencyInjector(mysqlPool);

  expressLoader(expressApp);
  logger.info('Load Express: OK');
};
