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

const generateHashRedis = (id, suffix, prefix = 'redis-saves') => {
  return `${prefix}:${id}:${suffix}`
}

const getKey = async (key, client) => {
  try {
    return client.get(key)
  } catch (err) {
    logger.error({ redis: { error: err } }, 'Redis GET cache failed')
  }
}

const setKey = async (key, value, client, options) => {
  try {
    await client.set(key, value, options)
  } catch (err) {
    logger.error({ redis: { error: err } }, 'Redis SET cache failed')
  }
}

export { logger, generateHashRedis, setKey, getKey }
