import 'reflect-metadata';
import express from 'express';

import loader from '@loader/';
import config from '@config/';
import logger from '@util/logger';

async function bootstrapServer() {
  try {
    const app = express();
    app.use(express.json());

    await loader(app);

    app.listen(config.serverPort, () => {
      logger.info(`Server Listening On Port: ${config.serverPort}`);
    });
  } catch (e) {
    logger.error('Server Start: FAIL', e);
  }
}

bootstrapServer();
