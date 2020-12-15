const faker = require('faker');

module.exports = {
    server: {
        // Avoid conflicting ports if running locally
        connection: {
            port: faker.random.number({
                min: 10000,
                max: 20000
            }),
        },
    },
    mongodb:{
        url: 'mongodb://localhost:27017/prophius-test'
    }
};