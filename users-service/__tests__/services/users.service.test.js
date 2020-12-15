const faker = require('faker');
const Errors = require('../../src/lib/errors');

const {
    createRandomUser
} = require('../mocks/users');
const {
    initDB
} = require('../../src/utils/database')

async function setupUsers(
    User,
    count = faker.random.number({
        min: 120,
        max: 150
    }),
) {
    const users = [...new Array(count)]
        .map((v, i) => createRandomUser({
            name: `user ${i}: ${faker.lorem.sentence()}`
        }));
    await User.insertMany(users);
}

describe('users service', () => {
    let usersService;
    let User;
    beforeAll(async () => {
        await initDB();
        const {
            models
        } = require('../../src/models');

        const {
            createServices
        } = require('../../src/services/service-factory');
        usersService = createServices().users;
        User = models.User;
        await User.deleteMany({}).catch(() => ({}));
    });

    afterAll(() => database.close());

    describe('insertuser', () => {
        it('should insert user', async () => {
            const user = createRandomUser();
            const newUser = await usersService.createUser(user);
            const insertedUser = await User.findById(newUser._id);
            expect(insertedUser.email).toEqual(user.email);
        });
    });
    describe('insertuser', () => {
        it('should return error', async () => {
            await setupUsers(User, 1);
            const databaseUsers = await User.find().limit(1);
            const response = await usersService.createUser(databaseUsers[0]);
            expect(response.error).toEqual("User Exist");
        });
    });

    describe('throw error trying to insert wrong user payload', () => {
        it('should throw error', async () => {
            const user = {
                email: 'pppp'
            };
            await expect(usersService.createUser(user)).rejects.toThrow('User validation failed: mobile: Path `mobile` is required., lastname: Path `lastname` is required., firstname: Path `firstname` is required.');
        });
    });
});