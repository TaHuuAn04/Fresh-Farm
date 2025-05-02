import DatabaseConfig from './database/db.config';
import LogConfig from './logger/log.config';
import { ConfigFactory } from '@nestjs/config';

export const configurations: ConfigFactory[] = [DatabaseConfig, LogConfig];
export { DatabaseConfig, LogConfig };
