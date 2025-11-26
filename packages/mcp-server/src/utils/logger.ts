/**
 * 日志工具
 */

import winston from 'winston';

const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

export const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // 控制台输出
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          let msg = `${timestamp as string} [${level}] ${message as string}`;
          if (Object.keys(meta).length > 0) {
            msg += ` ${JSON.stringify(meta)}`;
          }
          return msg;
        })
      ),
    }),
    // 文件输出
    new winston.transports.File({
      filename: process.env.PARSEFLOW_LOG_FILE || 'parseflow.log',
      level: 'info',
    }),
    new winston.transports.File({
      filename: process.env.PARSEFLOW_ERROR_LOG_FILE || 'parseflow-error.log',
      level: 'error',
    }),
  ],
});
