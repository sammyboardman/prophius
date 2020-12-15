const rabbit = require('./initQueue');

module.exports = async (queue, msg) => {
    const broker = await rabbit.getInstance();
    broker.send(queue, msg);
}
