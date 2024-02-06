import 'dotenv/config'

import channelWrapper from './amqp.js'
import data from './data.js'
import { rabbitmq } from './config.js'
import { sleep } from './helpers.js'

(async () => {
  const { queue, publisherSleep } = rabbitmq

  for (const msg of data) {
    channelWrapper.sendToQueue(queue, msg)
      .then(() => console.log('Message was sent'))
      .catch((err) => console.log(`Message was rejected: ${err}`))
    await sleep(publisherSleep)
  }
  process.exit(1)
})()
