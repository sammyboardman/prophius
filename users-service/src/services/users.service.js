const {
    models
} = require('../models');
const constants = require('../utils/constant');
const { logger } = require('../lib/logger');
const { constant } = require('lodash');
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
            async getAll({
                offset = 0,
                limit = 100
            } = {}) {
                return await User.find({}).skip(offset).limit(limit);
            },
            async getUserById(userId) {
                const user = await User.findById(userId);
                if (!user) {
                    return {
                        error: constants.UserNotFound,
                    };
                }
                return user;
            },
            async updateUser(user, userId) {
                const updatedUser = await User.findOneAndUpdate({
                    _id: userId
                }, user, {
                    new: true
                });
                if (updatedUser) {
                    return updatedUser;
                }
                return {
                    error: constants.InvalidUser
                }
            },

            async deleteUser(userId) {
                try {
                    const userExist = await this.getUserById(userId);
                    if (!userExist.error) {
                        await User.deleteOne({
                            _id: userId
                        });
                        return { response: constants.Success };
                    }
                    return { error: constants.InvalidUser };

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