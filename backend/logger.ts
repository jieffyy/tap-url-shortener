import expressWinston from 'express-winston'
import winston from 'winston'

// req logger middleware
const reqLogger = expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: winston.format.json(),
})

// logger singleton
const logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console()],
  format: winston.format.json(),
})

export { logger, reqLogger }