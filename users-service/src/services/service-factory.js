const {
    createUsersService,
} = require('./');

const createServices = () => ({
    users: createUsersService(),
});

module.exports = {
    createServices
};