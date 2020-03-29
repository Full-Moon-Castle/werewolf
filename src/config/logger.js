const winston = require('winston');

const { format, createLogger, transports } = winston;
const { printf, combine, colorize, timestamp } = format;
const { Console } = transports;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${level}: [${timestamp}] ${message}`;
});

const logger = createLogger({
  format: combine(colorize(),
      timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
      format.splat(),
      myFormat),
  transports: [
    new Console(),
  ],
});

module.exports = logger;
