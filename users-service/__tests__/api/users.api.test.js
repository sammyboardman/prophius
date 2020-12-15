const faker = require('faker');
const {
    createServices
} = require('../mocks/service-factory');
const {
    startServer
} = require('../../src/app');

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
                mobile: faker.lorem.word(),
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
                mobile: faker.lorem.word(),
            }
            const options = {
                method: 'POST',
                url: '/api/user',
                payload: JSON.stringify(newUser)
            };

            const response = await server.inject(options);
            expect(response.statusCode).toBe(400);
            expect(response.result.message).toEqual("User Exist");
        });

    });
    describe('GET /v1/users', () => {
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
});