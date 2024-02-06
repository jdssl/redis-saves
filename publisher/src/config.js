export const rabbitmq = {
  url: process.env.RABBITMQ_URL || 'amqp://localhost',
  queue: process.env.TASKS_QUEUE || 'tasks'
}
