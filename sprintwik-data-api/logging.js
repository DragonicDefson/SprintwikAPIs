const essentials = require('./essentials')
const winston = require('winston')

module.exports = {
  log : (level, message) => {
    const date = new Date()
    const formatted_date = '[' 
    + essentials.format(date.getFullYear()) + ':'
    + essentials.format(date.getMonth()) + ':'
    + essentials.format(date.getDate()) + ':'
    + essentials.format(date.getHours()) + ':'
    + essentials.format(date.getMinutes()) + ':'
    + essentials.format(date.getSeconds()) + ']'
    const logger = winston.createLogger({
      level: level,
      format: winston.format.json(),
      transports: [
        new winston.transports.File({ filename: 'logs/warning.log', level: 'warning' }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/info.log', level: 'info' })
      ]
    })
    logger.log({ level: level, message: formatted_date + ' ' + level + ' : ' + message })
  }
}
