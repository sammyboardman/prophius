const {
    createNotificationService,
} = require('./');

const createServices = () => ({
    user: createNotificationService(),
});

module.exports = {
    createServices
};