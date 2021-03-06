const {
    error
} = require('../lib/errors');
const constants = require('../utils/constant');

const createUser = async (request, resp) => {
    const user = request.payload;
    const response = await request.server.app.services.users.createUser(user);
    if (response.error) {
        return error(400, response.error);
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

const getUser = async (request, resp) => {
    const userID = request.params.id;
    const value = await request.server.app.services.users.getUserById(userID);
    if (value.error) {
        return error(404, value.error);
    }
    return value;

};

const updateUser = async (request) => {
    const user = request.payload;
    if(Object.keys(user).length === 0 && user.constructor === Object){
        return error(400, constants.EmptyPayload);
    }
    const userId = request.params.id;
    const response = await request.server.app.services.users.updateUser(user, userId);
    if (response.error) {
        return error(400, response.error);
    }
    return response;
}
const deleteUser = async (request) => {
    const userId = request.params.id;
    const response = await request.server.app.services.users.deleteUser(userId);
    if (response.error) {
        return error(400, response.error);
    }
    return response;
}
module.exports = {
    createUser,
    getAll,
    getUser,
    updateUser,
    deleteUser
};