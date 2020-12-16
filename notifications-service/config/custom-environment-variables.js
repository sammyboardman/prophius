module.exports = {
    server: {
        connection: {
            port: 'SERVER_PORT',
        },
    },
    rabbitMQ: {
        url: 'RABBITMQ_URL',
    },
    mail: {
        from: 'FROM_EMAIL'
    },
    mailgun: {
        api_key: 'MAILGUN_API_KEY',
        domain: 'DOMAIN'
    }
};
