
const config = require('config');
const { logger } = require('../../lib/logger');
const MailComposer = require('nodemailer/lib/mail-composer');

module.exports = function sendEmail(payload) {
    const api_key = config.mailgun.api_key;
    const domain = config.mailgun.domain;
    const mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });
    const mail = new MailComposer(payload);

    mail.compile().build((err, message) => {

        const dataToSend = {
            to: payload.to,
            message: message.toString('ascii')
        };

        mailgun.messages().sendMime(dataToSend, (sendError, body) => {
            if (sendError) {
                logger.log({
                    level: 'error',
                    message: sendError
                });
                return;
            }
        });
    });
}