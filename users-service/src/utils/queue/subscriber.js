const rabbit = require('./initQueue');

module.exports = async (queue) => {
    const broker = await rabbit.getInstance();
    broker.subscribe(queue, (msg, ack) => {
        ack();
    });
}
