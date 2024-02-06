export const rabbitmq = {
  url: process.env.RABBITMQ_URL || 'amqp://localhost',
  exchange: process.env.EXCHANGE || 'tasks',
  routingKey: process.env.ROUTING_KEY || 'create',
  publisherSleep: Number(process.env.PUBLISHE_SLEEP_MS) || 1000
}
