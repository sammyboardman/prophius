const faker = require('faker');
const {
    createServices
} = require('../mocks/service-factory');
const {
    startServer
} = require('../../src/app');
const constants = require('../../src/utils/constant');
describe('users controller', () => {
    let server;
    let usersService;
    beforeAll(async () => {
        const services = createServices();
        server = await startServer({
            services
        });
        usersService = services.users;
    });

    afterAll(async () => {
        await server.stop({
            timeout: 0
        });
    });


    describe('POST /api/user', () => {
        it('create a user', async () => {
            const newUser = {
                email: 'test1@gmail.com',
                firstname: faker.lorem.word(),
                lastname: faker.lorem.word(),
                mobile: '+2347069671224',
            }
            const options = {
                method: 'POST',
                url: '/api/user',
                payload: JSON.stringify(newUser)
            };
            const response = await server.inject(options);
            expect(response.statusCode).toBe(200);
            expect(response.result.email).toEqual(newUser.email);
        });

        it('throw error for existing user', async () => {
            const newUser = {
                email: 'test1@gmail.com',
                firstname: faker.lorem.word(),
                lastname: faker.lorem.word(),
                mobile: '+2347069671335',
            }
            const options = {
                method: 'POST',
                url: '/api/user',
                payload: JSON.stringify(newUser)
            };

            const response = await server.inject(options);
            expect(response.statusCode).toBe(400);
            expect(response.result.message).toEqual(constants.UserExist);
        });

        it('throw error for existing mobile', async () => {
            const newUser = {
                email:  faker.internet.email(),
                firstname: faker.lorem.word(),
                lastname: faker.lorem.word(),
                mobile: '+2347069671224',
            }
            const options = {
                method: 'POST',
                url: '/api/user',
                payload: JSON.stringify(newUser)
            };

            const response = await server.inject(options);
            expect(response.statusCode).toBe(400);
            expect(response.result.message).toEqual(constants.MobileAlreadyUsed);
        });

    });
    describe('GET /api/users', () => {
        it('gets all users (without parameters)', async () => {
            const options = {
                method: 'GET',
                url: '/api/users',
            };
            const response = await server.inject(options);
            expect(response.statusCode).toBe(200);
            expect(response.result.count).toBe(100);
            expect(response.result.users).toHaveLength(100);
            expect(response.result.users).toEqual(await usersService.getAll());
        });

        it('gets page 1 of all users', async () => {
            const limit = 10;
            const offset = 10;
            const expected = await usersService.getAll({
                offset,
                limit
            });
            const options = {
                method: 'GET',
                url: `/api/users?offset=${offset}&limit=${limit}`,
            };
            const response = await server.inject(options);
            expect(response.statusCode).toBe(200);
            expect(response.result.count).toBe(limit);
            expect(response.result.users).toHaveLength(limit);
            expect(response.result.users).toEqual(expected);
        });

        it('gets page 2 of all users', async () => {
            const limit = 10;
            const offset = 20;
            const expected = await usersService.getAll({
                offset,
                limit
            });
            const options = {
                method: 'GET',
                url: `/api/users?offset=${offset}&limit=${limit}`,
            };
            const response = await server.inject(options);
            expect(response.statusCode).toBe(200);
            expect(response.result.users).toHaveLength(limit);
            expect(response.result.users).toEqual(expected);
        });

        it('returns empty response if no users', async () => {
            const options = {
                method: 'GET',
                url: '/api/users?offset=9999',
            };
            const response = await server.inject(options);
            expect(response.statusCode).toBe(200);
            expect(response.result.count).toBe(0);
            expect(response.result.users).toHaveLength(0);
        });

    });
    describe('GET /api/users/{id}', () => {
        it('gets a user by ID', async () => {
            const [expected] = await usersService.getAll();
            const options = {
                method: 'GET',
                url: `/api/user/${expected._id}`,
            };
            const response = await server.inject(options);
            expect(response.statusCode).toBe(200);
            expect(response.result).toEqual(expected);
        });

        it('throws invalid request if the ID is invalid', async () => {
            const options = {
                method: 'GET',
                url: '/api/user/123',
            };
            const response = await server.inject(options);
            expect(response.statusCode).toBe(400);
            expect(response.result.error).toBe('Bad Request');
            expect(response.result.message).toBe('Invalid request params input');
        });

        it('throws 404 on missing user', async () => {
            const options = {
                method: 'GET',
                url: faker.fake('/api/user/{{random.alphaNumeric(24)}}'),
            };
            const response = await server.inject(options);
            expect(response.statusCode).toBe(404);
            expect(response.result.error).toBe('Not Found');
            expect(response.result.message).toBe(constants.UserNotFound);
        });
    });
    describe('PATCH /api/user', () => {
        it('update a user', async () => {
            const [expected] = await usersService.getAll();
            const user = {
                firstname: faker.lorem.word(),
                lastname: faker.lorem.word(),
            }
            const options = {
                method: 'PATCH',
                url: `/api/user/${expected._id}`,
                payload: JSON.stringify(user)
            };
            const response = await server.inject(options);
            expect(response.statusCode).toBe(200);
            expect(response.result.firstname).toEqual(user.firstname);
        });

        it('throw error for invalid user', async () => {
            const user = {
                firstname: faker.lorem.word(),
                lastname: faker.lorem.word(),
            }
            const options = {
                method: 'PATCH',
                url: faker.fake('/api/user/{{random.alphaNumeric(24)}}'),
                payload: JSON.stringify(user)
            };

            const response = await server.inject(options);
            expect(response.result.message).toEqual(constants.InvalidUser);
        });
        it('throw error for empty payload', async () => {
            const [expected] = await usersService.getAll();
            const user = { };
            const options = {
                method: 'PATCH',
                url: `/api/user/${expected._id}`,
                payload: JSON.stringify(user)
            };
            const response = await server.inject(options);
            expect(response.result.message).toEqual(constants.EmptyPayload);
        });

    });
    describe('DELETE /api/users/{id}', () => {
        it('gets a user by ID', async () => {
            const [expected] = await usersService.getAll();
            const options = {
                method: 'DELETE',
                url: `/api/user/${expected._id}`,
            };
            const response = await server.inject(options);
            expect(response.statusCode).toBe(200);
            expect(response.result.response).toEqual(constants.Success);
        });

        it('throws invalid request if the ID is invalid', async () => {
            const options = {
                method: 'DELETE',
                url: '/api/user/123',
            };
            const response = await server.inject(options);
            expect(response.statusCode).toBe(400);
            expect(response.result.error).toBe('Bad Request');
            expect(response.result.message).toBe('Invalid request params input');
        });

        it('throws 400 on invalid user', async () => {
            const options = {
                method: 'DELETE',
                url: faker.fake('/api/user/{{random.alphaNumeric(24)}}'),
            };
            const response = await server.inject(options);
            expect(response.statusCode).toBe(400);
            expect(response.result.error).toBe('Bad Request');
            expect(response.result.message).toBe(constants.InvalidUser);
        });
    });
});