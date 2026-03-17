import pino from 'pino';
import config from './config.js';

const isDev = process.env.NODE_ENV !== 'production';

const targets: pino.TransportTargetOptions[] = [
  {
    target: 'pino-pretty',
    level: config.logLevel,
    options: {
      colorize: isDev,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
];

if (config.logFile) {
  targets.push({
    target: 'pino/file',
    level: config.logLevel,
    options: {
      destination: config.logFile,
      mkdir: true,
    },
  });
}

const logger = pino({
  level: config.logLevel,
  transport: {
    targets,
  },
});

logger.info('Logger initialized with level: %s', config.logLevel);

export default logger;
