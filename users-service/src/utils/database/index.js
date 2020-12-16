const schema = require('../../models');
const config = require('config');
const { logger } = require('../../lib/logger');
const runSeed = require('./seed')

const initDB = async function () {
    try {
        const mongodbUrl = config.mongodb.url;
        schema.getMongooseConnection(mongodbUrl);
        await schema.createModels(mongodbUrl);
        if (config.seed) {
            await runSeed(schema.models.User, 50);
        }
    } catch (ex) {
        logger.log({ level: 'error', message: ex.message });
    }
}

module.exports = { initDB };
