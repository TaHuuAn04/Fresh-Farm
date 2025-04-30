import {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME_DEVELOPMENT,
} from '@environments';
import { NamingStrategy } from './database/typeorm/naming.strategy';
import { DataSource, DataSourceOptions } from 'typeorm';

const source: DataSourceOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME_DEVELOPMENT,
  entities: [`${__dirname}/database/entities/*.entity{.ts,.js}`],
  namingStrategy: new NamingStrategy(),
  migrationsTableName: '__migrations',
  migrations: ['./database/migrations/**/*.ts'],
  synchronize: false,
  logging: true,
};
export const sourceConfig = new DataSource(source);
