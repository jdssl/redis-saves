export const rabbitmq = {
  url: process.env.RABBITMQ_URL || 'amqp://root:123456@localhost:5672',
  exchange: process.env.EXCHANGE || 'tasks',
  routingKey: process.env.ROUTING_KEY || 'create',
  publisherSleep: Number(process.env.PUBLISHER_SLEEP_MS) || 3000
}
