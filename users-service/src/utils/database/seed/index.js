
const faker = require('faker');
const {
    createRandomUser
} = require('./usersdata');

module.exports = async function seedUsers(
    User,
    count = faker.random.number({
        min: 30,
        max: 35
    }),
) {
    const users = [...new Array(count)]
        .map((v, i) => createRandomUser({ mobile: `+23480334${10000 + i}` }));
    await User.deleteMany({}).catch(() => ({}));
    users.forEach(async user => {
        await User.create(user);
    });
}