const faker = require('faker');
const {
    createRandomUser
} = require('./users');

function createUsersService() {
    const users = new Array(faker.random.number({
        min: 120,
        max: 150
    }))
        .fill()
        .map((v, i) => createRandomUser({}));
    return {
        createUser(user) {
            for (let i = 0; i < users.length; i++) {
                if (users[i].email === user.email) {
                    return {
                        error: "User Exist"
                    }
                }
            }
            const newUser = createRandomUser(user);
            users.push(newUser);
            return users[users.length - 1];
        }
    };
}

module.exports = {
    createUsersService
};