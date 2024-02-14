export const rabbitmq = {
  url: process.env.RABBITMQ_URL || 'amqp://localhost',
  queue: process.env.QUEUE || 'redis_saves',
  exchange: process.env.EXCHANGE || 'tasks',
  routingKey: process.env.ROUTING_KEY || 'create'
}
