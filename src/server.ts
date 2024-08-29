import 'reflect-metadata';

import config from '@config/';
import initContainer from '@loader/container';
import getApp from '@loader/expressApp';
import logger from '@util/logger';

async function bootstrapServer() {
  try {
    initContainer();

    const app = getApp();

    app.listen(config.serverPort, () => {
      logger.info(`Server Listening On Port: ${config.serverPort}`);
    });
  } catch (e) {
    logger.error(e);
    logger.error('Server Start: FAIL');
  }
}

bootstrapServer();
