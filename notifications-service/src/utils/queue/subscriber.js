const rabbit = require('./initQueue');
const constants = require('../constant');

module.exports = async (queue) => {
    const broker = await rabbit.getInstance();
    broker.subscribe(queue, (msg, ack) => {
        const payload = msg.content.toString();
        const objPayload = JSON.parse(JSON.stringify(payload));
        if(msg.fields.routingKey === constants.CreateUserQueue){

        }else if(msg.fields.routingKey === constants.DeleteUserQueue){

        }
        ack();
    });
}
