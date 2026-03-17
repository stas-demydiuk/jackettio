import sqlite3 from 'sqlite3';
import sqliteStore from 'cache-manager-sqlite';
import cacheManager from 'cache-manager';
import redisStore from 'cache-manager-ioredis';
import Redis from 'ioredis';
import config from './config.js';
import { wait } from './util.js';
import logger from './logger.ts';

let cache;
let db;

if (config.cacheType === 'redis') {
  logger.info(`Using Redis cache: ${config.redisHost}:${config.redisPort}`);
  const redisClient = new Redis({
    host: config.redisHost,
    port: config.redisPort,
    password: config.redisPassword,
    db: config.redisDb,
    maxRetriesPerRequest: null,
  });

  redisClient.on('error', (err) => {
    logger.error({ err }, 'Redis Cache Error');
  });

  cache = await cacheManager.caching({
    store: redisStore,
    redisInstance: redisClient,
    ttl: 86400,
  });
} else if (config.cacheType === 'memory') {
  logger.info('Using in-memory cache');

  cache = await cacheManager.caching({
    store: 'memory',
    ttl: 86400,
  });
} else {
  logger.info(`Using SQLite cache: ${config.dataFolder}/cache.db`);
  db = new sqlite3.Database(`${config.dataFolder}/cache.db`);

  cache = await cacheManager.caching({
    store: sqliteStore,
    path: `${config.dataFolder}/cache.db`,
    options: { ttl: 86400 },
  });
}

export default cache;

export async function clean() {
  if (config.cacheType !== 'sqlite') {
    logger.warn('Cache clean() is only applicable for SQLite cache.');
    return;
  }
  logger.info('Cleaning SQLite cache...');
  await cache.set('_clean', 'todo', { ttl: 1 });
  await wait(3e3);
  await cache.get('_clean');
  logger.info('SQLite cache cleaned.');
}

export async function vacuum() {
  if (config.cacheType !== 'sqlite') {
    logger.warn('Cache vacuum() is only applicable for SQLite cache.');
    return;
  }
  logger.info('Vacuuming SQLite cache database...');
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('VACUUM', (err) => {
        if (err) {
          logger.error({ err }, 'Error vacuuming SQLite DB');
          return reject(err);
        }
        logger.info('SQLite cache database vacuumed.');
        resolve();
      });
    });
  });
}
