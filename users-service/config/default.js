module.exports = {
    swagger: {
        active: true,
        host: 'localhost:5071',
    },
    server: {
        connection: {
            compression: false,
            port: 5071,
            routes: {
                cors: true,
            },
        },
    },
};
