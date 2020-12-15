const crypto = require('crypto');

const faker = require('faker');

function randomObjectId() {
    return crypto.randomBytes(Math.ceil(24 / 2)).toString('hex');
}

function createRandomUser(options) {
    return {
        _id: randomObjectId(),
        __v: 74,
        email: faker.internet.email(),
        firstname: faker.lorem.word(),
        lastname: faker.lorem.word(),
        mobile: faker.lorem.word(),
        ...options,
    };
}

module.exports = {
    createRandomUser
};