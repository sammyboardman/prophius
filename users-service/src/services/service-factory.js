const {
    createUsersService,
} = require('.');

const createServices = () => ({
    user: createUsersService(),
});

module.exports = {
    createServices
};