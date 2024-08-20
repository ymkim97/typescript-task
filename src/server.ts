import express from 'express';
import config from './config';
import loader from './loader';
import logger from './config/logger';

async function bootstrapServer() {
  try {
    const app = express();

    await loader(app);

    app.listen(config.serverPort, () => {
      logger.info(`Server Listening On Port: ${config.serverPort}`);
    });
  } catch (err) {
    logger.error('Server Start: FAIL');
  }
}

bootstrapServer();
