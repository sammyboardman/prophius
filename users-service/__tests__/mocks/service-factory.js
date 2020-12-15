const {
    createUsersService
} = require('./users.service');

const createServices = () => ({
    users: createUsersService(),
});

module.exports = {
    createServices
};