import * as dotenv from 'dotenv';

dotenv.config();

export const MAIN_PORT = process.env.MAIN_PORT || 3000;
// Setup the environment variables
export const PROJECT_NAME = process.env.PROJECT_NAME;
export const DB_USER = process.env.DB_USER;
export const DB_PASS = process.env.DB_PASS;
export const DB_NAME_DEVELOPMENT = process.env.DB_NAME_DEVELOPMENT;
export const DB_NAME_TEST = process.env.DB_NAME_TEST;
export const DB_NAME_PRODUCTION = process.env.DB_NAME_PRODUCTION;
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT;
export const DB_DIALECT = process.env.DB_DIALECT;
export const DB_SSL = process.env.DB_SSL;
export const NODE_ENV = process.env.NODE_ENV;

export const ADAFRUIT_USERNAME =
  process.env.ADAFRUIT_USERNAME || 'adafruit_username';
export const ADAFRUIT_KEY = process.env.ADAFRUIT_KEY || 'adafruit_key';

export const JWT_ACCESS_TOKEN_SECRET =
  process.env.JWT_ACCESS_TOKEN_SECRET || 'defaultSecret';
export const JWT_ACCESS_TOKEN_EXPIRATION_TIME =
  process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME || `${60 * 60}`;
export const JWT_REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_TOKEN_SECRET || 'defaultSecret';
export const JWT_REFRESH_TOKEN_EXPIRATION_TIME =
  process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME || `${60 * 60 * 24 * 7}`;
