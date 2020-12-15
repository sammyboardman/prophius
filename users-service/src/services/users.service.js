const {
    models
} = require('../models');
const constants = require('../utils/constant');
const { logger } = require('../lib/logger');
module.exports = {
    createUsersService() {
        const User = models.User;
        return {
            async createUser(user) {
                try {
                    const userExist = await User.findOne({
                        email: user.email
                    });
                    if (!userExist) {
                        return await User.create(user);
                    }
                    return {
                        error: constants.UserExist
                    }
                } catch (ex) {
                    logger.log({
                        level: 'error',
                        message: ex.message
                    });
                    throw new Error(ex.message);
                }
            },
           
        };
    },
};