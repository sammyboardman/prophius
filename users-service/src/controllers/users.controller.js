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
module.exports = {
    createUser
};