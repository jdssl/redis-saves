export const rabbitmq = {
  url: process.env.RABBITMQ_URL || 'amqp://localhost',
  queue: process.env.QUEUE || 'redis_saves',
  exchange: process.env.EXCHANGE || 'tasks',
  routingKey: process.env.ROUTING_KEY || 'create'
}
export const redis = {
  host: process.env.DB_REDIS_HOST || 'redis.dev.devmuch.io',
  port: process.env.DB_REDIS_PORT || 6379,
  db: process.env.DB_REDIS_DB || 7,
  ttl: { EX: Number(process.env.DB_REDIS_TTL) || 604800 }
}
