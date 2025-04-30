import {
  DB_NAME_DEVELOPMENT,
  DB_PASS,
  DB_USER,
  DB_PORT,
  DB_HOST,
} from '@environments';
import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { NamingStrategy } from '../../../database/typeorm/naming.strategy';
import { join } from 'path';
import { CONFIG_KEY } from '../config-key';

export default registerAs<TypeOrmModuleOptions>(CONFIG_KEY.DATABASE, () => ({
  type: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME_DEVELOPMENT,
  logging: true,
  autoLoadEntities: true,
  keepConnectionAlive: true,
  entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
  namingStrategy: new NamingStrategy(),
  synchronize: true,
}));
