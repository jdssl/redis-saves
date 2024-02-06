import amqp from 'amqp-connection-manager'

import { rabbitmq } from './config.js'

const { url, queue } = rabbitmq
const connection = amqp.connect(url)

const channelWrapper = connection.createChannel({
  json: true,
  setup: (channel) => {
    return channel.assertQueue(queue, { durable: true })
  }
})

export default channelWrapper
