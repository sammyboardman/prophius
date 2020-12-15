const Joi = require('joi');
const namespace = require('hapijs-namespace');
const {
    usersController
} = require('../controllers');

module.exports = (server, prefix) => {
    namespace(server, prefix, [
        {
            method: 'POST',
            path: '/user',
            config: {
                description: 'Create a user',
                tags: ['api', 'users'],
                validate: {
                    payload: Joi.object({
                        email: Joi.string().email()
                            .required()
                            .description('user email'),
                        firstname: Joi.string()
                            .required()
                            .description('user first name'),
                        lastname: Joi.string()
                            .required()
                            .description('user last name'),
                        mobile: Joi.string()
                            .required()
                            .description('user mobile phone'),
                    }),
                },
                handler: usersController.createUser,


            },
        },
        {
            method: 'GET',
            path: '/users',
            config: {
                description: 'Get all users',
                tags: ['api', 'users'],
                handler: usersController.getAll,
                validate: {
                    query: Joi.object({
                        limit: Joi.number()
                            .description('max number of items to fetch'),
                        offset: Joi.number()
                            .description('number of items to skip'),
                    }),
                },
                plugins: {
                    'hapi-swagger': {
                        id: 'users',
                        responses: {
                            200: {
                                description: 'Should return status 200',
                                schema: Joi.object({
                                    count: Joi.number().required().example(1),
                                    users: Joi.array().items({
                                        _id: Joi.string().required().example('5fb55fd471da0f122d564e7a'),
                                        email: Joi.string().required().example('t@w.v'),
                                        lastname: Joi.string().required().example('Samu'),
                                        firstname: Joi.string().required().example('Alajo'),
                                        mobile: Joi.string().required().example('+23470050005005'),
                                        updatedAt: Joi.string().required().example('2020-11-18T17:54:28.209Z'),
                                        createdAt: Joi.string().required().example('2020-11-18T17:54:28.209Z')
                                    })
                                }).label('User'),

                            },


                        },
                    },
                },
            },
        },
        {
            method: 'GET',
            path: '/user/{id}',
            config: {
                description: 'Get single user by ID',
                tags: ['api', 'users'],
                validate: {
                    params: Joi.object({
                        id: Joi.string()
                            .required()
                            .min(24)
                            .max(24)
                            .description('the id of the user to return'),
                    })
                },
                handler: usersController.getUser,
                plugins: {
                    'hapi-swagger': {
                        id: 'users',
                        responses: {
                            200: {
                                description: 'Should return status 200',
                                schema: Joi.object({
                                    _id: Joi.string().required().example('5fb55fd471da0f122d564e7a'),
                                    email: Joi.string().required().example('t@w.v'),
                                    name: Joi.string().required().example('Samu'),
                                    role: Joi.string().required().example('admin'),
                                    updatedAt: Joi.string().required().example('2020-11-18T17:54:28.209Z'),
                                    createdAt: Joi.string().required().example('2020-11-18T17:54:28.209Z')

                                }).label('User'),

                            },


                        },
                    },
                },
            },
        },
    ]);
};