import { Injectable } from '@nestjs/common'
import * as amqp from 'amqplib/callback_api'

@Injectable()
export class QueueService {
	public async send(msg: object, queue: string) {
		const rabbitUrl = await this.getRabbitUrl();
		if (!rabbitUrl) {
			console.error('Credentials for rabbitMQ not found');
		}

		amqp.connect(rabbitUrl, (err, conn) => {
		if (err) {
			console.error(err);
			return
		}
		conn.createChannel(async (err, ch) => {
			const fullQueueName = await this.getFullQueueName(queue)

			ch.assertQueue(fullQueueName, { durable: false, autoDelete: true})
			ch.sendToQueue(fullQueueName, Buffer.from(JSON.stringify(msg)))
			setTimeout(() => { conn.close() }, 500)
		})
		})
	}

	private async getFullQueueName(queueName: string) {
		const prefics = process.env.RABBITMQ_QUEUE_PREFICS || 'alpha'
		const nodeEnv = process.env.NODE_ENV || 'dev'
		return `${nodeEnv}.${prefics}.${queueName}`
	}

	private async getRabbitUrl() {
		const rabbitUser = process.env.RABBITMQ_USER
		const rabbitPass = process.env.RABBITMQ_PASSWORD
		const rabbitHost = process.env.RABBITMQ_HOST
		const rabbitPort = process.env.RABBITMQ_PORT
		if (!rabbitUser || !rabbitPass || !rabbitHost || !rabbitPort) {
			return null
		}
		return `amqp://${rabbitUser}:${rabbitPass}@${rabbitHost}:${rabbitPort}`
	}
}
