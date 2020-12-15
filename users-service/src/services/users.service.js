const {
    models
} = require('../models');
const constants = require('../utils/constant');
const { logger } = require('../lib/logger');
const { producer } = require('../utils/queue')
module.exports = {
    createUsersService() {
        const User = models.User;
        return {
            async createUser(user) {
                try {
                    const userExist = await User.findOne({
                        email: user.email
                    });
                    const mobileExist = await User.findOne({
                        mobile: user.mobile
                    });

                    if (!userExist) {
                        if (mobileExist) {
                            return {
                                error: constants.MobileAlreadyUsed
                            }
                        }
                        const newUser = await User.create(user);
                        producer(constants.CreateUserQueue, newUser);
                        return newUser;
                    }
                    return {
                        error: constants.UserExist
                    }
                } catch (ex) {
                    logger.log({
                        level: 'error',
                        message: ex.message
                    });
                    return { error: ex.message };
                }
            },
            async getAll({
                offset = 0,
                limit = 100
            } = {}) {
                console.log('---------> I got here')
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
                        producer(constants.DeleteUserQueue, userExist);
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