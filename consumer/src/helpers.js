import pino from 'pino'

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  },
  timestamp: `,"time":"${new Date().toISOString()}"`,
  base: {
    servcice_name: process.env.SERVICE_NAME || 'consumer',
    code_version: process.env.CODE_VERSION || 'v1.0.0'
  },
  messageKey: 'message'

})

export { logger }
