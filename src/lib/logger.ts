import pino from 'pino';
import config from './config.js';

const isDev = process.env.NODE_ENV !== 'production';

const logger = pino({
  level: config.logLevel,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: isDev,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
});

export default logger;
