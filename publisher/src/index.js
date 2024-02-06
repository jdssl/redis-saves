import 'dotenv/config'
import amqplib from 'amqplib'

import { rabbitmq } from './config.js'
import data from './data.js'

(async () => {
  const queue = 'tasks'
  const conn = await amqplib.connect(rabbitmq.url)

  const ch1 = await conn.createChannel()
  await ch1.assertQueue(queue)

  const ch2 = await conn.createChannel()

  for (const msg of data) {
    setInterval(() => {
      ch2.sendToQueue(queue, Buffer.from(msg))
      console.log(`Message sended: ${msg}`)
    }, 1000)
  }
})()
