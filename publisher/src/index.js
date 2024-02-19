import 'dotenv/config'
import amqp from 'amqp-connection-manager'

import data from './data.js'
import { rabbitmq } from './config.js'
import { logger, sleep } from './helpers.js'

const { url, exchange, routingKey, publisherSleep } = rabbitmq

const connection = amqp.connect(url)
connection.on('connect', () => logger.info('RabbitMQ connection established'))
connection.on('disconnect', err => logger.info({ error: err.stack }, 'RabbitMQ disconnected'))

const channelWrapper = connection.createChannel({
  json: true,
  setup: channel => channel.assertExchange(exchange, 'topic')
})

const sendMessage = (msg) => {
  channelWrapper.publish(exchange, routingKey, msg, { contentType: 'application/json', persistent: true })
    .then(() => {
      logger.info({ content: JSON.parse(JSON.stringify(msg)) }, 'Message sent')
    })
    .catch(err => {
      logger.error({ error: err.stack }, 'Message was rejected')
      channelWrapper.close()
      connection.close()
    })
}

;(async () => {
  await sleep(publisherSleep)

  for (const msg of data) {
    sendMessage(msg)
    await sleep(publisherSleep)
  }
})()
