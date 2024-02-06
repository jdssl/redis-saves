import 'dotenv/config'

import { rabbitmq } from './config.js'
import amqp from 'amqp-connection-manager'

(async () => {
  const { url, queue } = rabbitmq
  const onMessage = function (data) {
    const message = JSON.parse(data.content.toString())
    console.log('receiver: got message', message)
    channelWrapper.ack(data)
  }

  const connection = amqp.connect('ass')

  connection.on('connect', function () {
    console.log('Connected!')
  })

  connection.on('disconnect', function (err) {
    console.log('Disconnected.', err.stack)
  })

  const channelWrapper = connection.createChannel({
    setup: function (channel) {
      return Promise.all([
        channel.assertQueue(queue, { durable: true }),
        channel.prefetch(1),
        channel.consume(queue, onMessage)
      ])
    }
  })
})()
