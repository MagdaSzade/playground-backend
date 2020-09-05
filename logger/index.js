const { createLogger, format, transports } = require('winston');
const { combine, timestamp, prettyPrint } = format;

module.exports = createLogger({
  format: combine(
    timestamp(),
    prettyPrint(),
  ), 
  transports: [
      new transports.File({
        filename: 'combined.log',
        level: 'info',
      }),
      new transports.File({
        filename: 'errors.log',
        level: 'error',
      }),
      new transports.Console({
        level: 'silly',
      })
    ]
});