const faker = require('faker');
const constants = require('../../src/utils/constant');
const {
    createRandomUser
} = require('./users');
const _ = require('lodash');

function createUsersService() {
    const users = new Array(faker.random.number({
        min: 120,
        max: 150
    }))
        .fill()
        .map(() => createRandomUser({}));
    return {
        createUser(user) {
            for (let i = 0; i < users.length; i++) {
                if (users[i].email === user.email) {
                    return {
                        error: constants.UserExist
                    }
                }
            }
            const newUser = createRandomUser(user);
            users.push(newUser);
            return users[users.length - 1];
        },
        getAll({
            offset = 0,
            limit = 100
        } = {}) {
            return Promise.resolve(users.slice(
                offset,
                offset + limit,
            ));
        },
        getUserById(userID) {
            const user = users.filter((user) => user._id === userID)[0];
            if (!user) {
                return {
                    error: constants.UserNotFound
                };
            }
            return user;
        },
        updateUser(user, userId) {
            let selectedUser;
            if (Object.keys(user).length === 0 && user.constructor === Object) {
                return constants.EmptyPayload;
            }
            for (let i = 0; i < users.length; i++) {
                if (users[i]._id === userId) {
                    selectedUser = users[i];
                    break;
                }
            }
            if (selectedUser) {
                return Object.assign(selectedUser, user);
            }
            return {
                error: constants.InvalidUser
            };

        },
        deleteUser(userId) {
            let status = false;
            for (let i = 0; i < users.length; i++) {
                if (users[i]._id === userId) {
                    status = true;
                    break;
                }
            }
            if (status) {
                _.remove(users, function (user) { return user._id === userId; })
                return { response: constants.Success };
            }
            return {
                error: constants.InvalidUser
            };

        },
    };
}

module.exports = {
    createUsersService
};