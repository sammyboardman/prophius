const faker = require('faker');

const {
    createRandomUser
} = require('../mocks/users');
const {
    initDB
} = require('../../src/utils/database');
const constants = require('../../src/utils/constant');

async function setupUsers(
    User,
    count = faker.random.number({
        min: 30,
        max: 35
    }),
) {
    const users = [...new Array(count)]
        .map(() => createRandomUser({}));
     users.forEach(async user => {
        await User.create(user);
    });
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
        it('should return error if user exist', async () => {
            await setupUsers(User, 1);
            const databaseUsers = await User.find().limit(1);
            const response = await usersService.createUser(databaseUsers[0]);
            expect(response.error).toEqual(constants.UserExist);
        });

        it('should return error for duplicated mobile', async () => {
            await setupUsers(User, 1);
            const databaseUsers = await User.find().limit(1);

            const newPayload = {
                email: faker.internet.email(),
                firstname: faker.lorem.word(),
                lastname: faker.lorem.word(),
                mobile: databaseUsers[0].mobile
            }
            const response = await usersService.createUser(newPayload);
            expect(response.error).toEqual(constants.MobileAlreadyUsed);
        });
    });

    describe('getAll', () => {

        it('should get all users (without parameters)', async () => {
            const databaseUsers = await User.find();
            const users = await usersService.getAll();
            expect(users).toHaveLength(databaseUsers.length);
            expect(users).toEqual(databaseUsers);
        });

        it('should get page 1 of all users', async () => {
            const offset = 0;
            const limit = 10;
            const databaseUsers = await User.find().limit(limit);
            const users = await usersService.getAll({
                offset,
                limit
            });
            expect(users).toHaveLength(databaseUsers.length);
            expect(users).toEqual(databaseUsers);
        });

        it('should get page 2 of all users', async () => {
            const offset = 20;
            const limit = 10;
            const databaseUsers = await User.find()
                .skip(offset)
                .limit(limit)
            const users = await usersService.getAll({
                offset,
                limit
            });
            expect(users).toHaveLength(databaseUsers.length);
            expect(users).toEqual(databaseUsers);
        });

        it('should get an incomplete page 3 of all (25) users', async () => {
            const offset = 20;
            const limit = 10;
            const databaseUsers = await User.find()
                .skip(offset)
                .limit(limit)
            const users = await usersService.getAll({
                offset,
                limit
            });
            expect(users).toHaveLength(databaseUsers.length);
            expect(users).toEqual(databaseUsers);
        });
    });
    describe('getuserById', () => {
        it('should get a single user by id', async () => {
            const databaseUser = await User.findOne();
            const user = await usersService.getUserById(databaseUser._id);
            expect(user).toEqual(databaseUser);
        });

        it('should throw resource not found error if no such user', async () => {
            const response = await usersService.getUserById(faker.random.alphaNumeric(12));
            expect(response.error).toBe(constants.UserNotFound);
        });
    });
    describe('update user', () => {
        it('should update user', async () => {
            const user = {
                firstname: faker.lorem.word()
            }
            const databaseUsers = await User.find().limit(1);
            const updatedUser = await usersService.updateUser(user, databaseUsers[0]._id);
            expect(updatedUser.firstname).toEqual(user.firstname);
        });
        it('should return error if user is invalid', async () => {
            await setupUsers(User, 1);
            const user = {
                firstname: faker.lorem.word()
            }
            const response = await usersService.updateUser(user, '3890e27da02c23770bdb3e49');
            expect(response.error).toEqual(constants.InvalidUser);
        });
    });

    describe('delete user', () => {
        it('should delete user', async () => {
            const databaseUsers = await User.find().limit(1);
            const response = await usersService.deleteUser(databaseUsers[0]._id);
            const user = await usersService.getUserById(databaseUsers[0]._id);
            expect(response.response).toEqual(constants.Success);
            expect(user.error).toBe(constants.UserNotFound);

        });
        it('should return error if user is invalid', async () => {
            const response = await usersService.deleteUser('3890e27da02c23770bdb3e49');
            expect(response.error).toEqual(constants.InvalidUser);
        });
    });
});