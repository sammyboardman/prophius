const amqp = require('amqplib');
const _ = require('lodash');
const config = require('config');
const util = require('util');

let instance;

class MessageBroker {
    constructor() {
        this.queues = {}
    }

    async init() {
        this.connection = await amqp.connect(config.rabbitMQ.url);
        this.channel = await this.connection.createChannel();
        return this
    }

    async send(queue, msg) {
        if (!this.connection) {
            await this.init();
        }
        const message = new Buffer.from(msg);
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.sendToQueue(queue, message)
    }

    async subscribe(queue, handler) {
        if (!this.connection) {
            await this.init();
        }
        if (this.queues[queue]) {
            const existingHandler = _.find(this.queues[queue], h => h === handler)
            if (existingHandler) {
                return () => this.unsubscribe(queue, existingHandler)
            }
            this.queues[queue].push(handler)
            return () => this.unsubscribe(queue, handler)
        }

        await this.channel.assertQueue(queue, { durable: true });
        this.queues[queue] = [handler]
        this.channel.consume(
            queue,
            async (msg) => {
                const ack = _.once(() => this.channel.ack(msg))
                this.queues[queue].forEach(h => h(msg, ack))
            }
        );
        return () => this.unsubscribe(queue, handler)
    }

    async unsubscribe(queue, handler) {
        _.pull(this.queues[queue], handler)
    }
}

MessageBroker.getInstance = async function () {
    if (!instance) {
        const broker = new MessageBroker();
        instance = broker.init()
    }
    return instance;
};

module.exports = MessageBroker;