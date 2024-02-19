import 'dotenv/config'
import amqp from 'amqp-connection-manager'
import redis from 'redis'

import { logger } from './helpers.js'
import * as config from './config.js'

const clientRedis = redis.createClient({
  url: `redis://@${config.redis.host}:${config.redis.port}/${config.redis.db}`,
  disableOfflineQueue: true
})

clientRedis.on('ready', () => {
  logger.info('Redis connection established')
})

clientRedis.on('error', (error) => {
  logger.info({ error }, 'Redis connection failed')
})

const connection = amqp.connect(config.rabbitmq.url)
connection.on('connect', () => logger.info('Connected!'))
connection.on('disconnect', err => logger.error('Disconnected.', err.stack))

const onMessage = (msg) => {
  try {
    logger.info(' [x] Routing key: \'%s\'. Content: \'%s\' consumed', msg.fields.routingKey, msg.content.toString())
    channelWrapper.ack(msg)
  } catch (err) {
    logger.error(`Error: ${err}`)
    channelWrapper.ack(msg)
  }
}

const channelWrapper = connection.createChannel({
  setup: channel => {
    return Promise.all([
      channel.assertQueue(config.rabbitmq.queue, { exclusive: true, autoDelete: true }),
      channel.assertExchange(config.rabbitmq.exchange, 'topic'),
      channel.prefetch(1),
      channel.bindQueue(config.rabbitmq.queue, config.rabbitmq.exchange, config.rabbitmq.routingKey),
      channel.consume(config.rabbitmq.queue, onMessage)
    ])
  }
})

;(async () => {
  await clientRedis.connect()
  channelWrapper.waitForConnect()
    .then(() => {
      logger.info('Listening for messages')
    })
})()
