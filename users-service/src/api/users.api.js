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
    ]);
};