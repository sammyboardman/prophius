const {
    error
} = require('../lib/errors');

const createUser = async (request, resp) => {
    const user = request.payload;
    const response = await request.server.app.services.users.createUser(user);
    if (response.error) {
        return error(400, 'User Exist');
    }
    return response;

}
const getAll = async (request) => {
    const {
        offset,
        limit
    } = request.query;
    const users = await request.server.app.services.users.getAll({
        offset,
        limit
    });
    const response = {
        count: users.length,
        users: users
    };
    return response;
};
module.exports = {
    createUser,
    getAll
};