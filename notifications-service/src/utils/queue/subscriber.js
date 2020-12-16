const rabbit = require('./initQueue');
const constants = require('../constant');
const { sendEmail, emailBodyFormatter } = require('../email');

module.exports = async (queue) => {
    const broker = await rabbit.getInstance();
    broker.subscribe(queue, (msg, ack) => {
        const payload = msg.content.toString();
        const objPayload = JSON.parse(JSON.stringify(payload));
        let emailPayload;
        if (msg.fields.routingKey === constants.CreateUserQueue) {
            emailPayload = emailBodyFormatter(objPayload, constants.UserCreationSubject)
        } else if (msg.fields.routingKey === constants.DeleteUserQueue) {
            emailPayload = emailBodyFormatter(objPayload, constants.DeleteUserSubject);
        }
        sendEmail(emailPayload);
        ack();
    });
}
