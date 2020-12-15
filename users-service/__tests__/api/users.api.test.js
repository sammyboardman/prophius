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
});