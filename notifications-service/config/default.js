module.exports = {
    server: {
        connection: {
            compression: false,
            port: 5072,
            routes: {
                cors: true,
            },
        },
    },
    mail: {
        from: 'ADD_FROM_EMAIL_HERE'
    },
    mailgun: {
        api_key: 'ADD_MAILGUN_API_KEY_HERE',
        domain: 'ADD_DOMAIN_HERE'
    }
};
