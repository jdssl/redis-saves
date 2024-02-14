import 'dotenv/config'

import data from './data.js'
import { rabbitmq } from './config.js'
import amqp from 'amqp-connection-manager'
import { sleep } from './helpers.js'

const { url, exchange, routingKey, publisherSleep } = rabbitmq

const connection = amqp.connect(url)
connection.on('connect', () => console.log('Connected!'))
connection.on('disconnect', err => console.log('Disconnected.', err.stack))

const channelWrapper = connection.createChannel({
  json: true,
  setup: channel => channel.assertExchange(exchange, 'topic')
})

const sendMessage = (msg) => {
  channelWrapper.publish(exchange, routingKey, msg, { contentType: 'application/json', persistent: true })
    .then(() => {
      console.log('Message sent:', JSON.stringify(msg))
    })
    .catch(err => {
      console.log('Message was rejected:', err.stack)
      channelWrapper.close()
      connection.close()
    })
};

(async () => {
  await sleep(publisherSleep)

  for (const msg of data) {
    sendMessage(msg)
    await sleep(publisherSleep)
  }
})()
