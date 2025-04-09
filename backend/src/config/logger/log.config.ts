// src/config/logger.config.ts
import { registerAs } from '@nestjs/config';
import { format, transports } from 'winston';
import { CONFIG_KEY } from '../config-key';

const formatter = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.splat(),
  format.printf(({ level, message, timestamp, stack }) => {
    const time = new Date((timestamp ?? '') as string).toLocaleString('vi-VN');
    return `[${time}] ${level}: ${stack || message}`;
  }),
);

export default registerAs(CONFIG_KEY.LOGGER, () => ({
  transports: [
    new transports.Console({
      format: formatter,
      level: process.env.LOG_LEVEL || 'debug',
      silent: process.env.NODE_ENV === 'production',
    }),
  ],
}));
