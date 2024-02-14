import 'dotenv/config'
import amqp from 'amqp-connection-manager'

import { rabbitmq } from './config.js'

const { url, exchange, routingKey, queue } = rabbitmq

const connection = amqp.connect(url)
connection.on('connect', () => console.log('Connected!'))
connection.on('disconnect', err => console.log('Disconnected.', err.stack))

const onMessage = (msg) => {
  try {
    console.log(' [x] Routing key: \'%s\'. Content: \'%s\' consumed', msg.fields.routingKey, msg.content.toString())
    channelWrapper.ack(msg)
  } catch (err) {
    console.log(`Error: ${err}`)
    channelWrapper.ack(msg)
  }
}

const channelWrapper = connection.createChannel({
  setup: channel => {
    return Promise.all([
      channel.assertQueue(queue, { exclusive: true, autoDelete: true }),
      channel.assertExchange(exchange, 'topic'),
      channel.prefetch(1),
      channel.bindQueue(queue, exchange, routingKey),
      channel.consume(queue, onMessage)
    ])
  }
})

channelWrapper.waitForConnect()
  .then(function () {
    console.log('Listening for messages')
  })
