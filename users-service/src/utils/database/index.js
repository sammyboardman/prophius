const schema = require('../../models');
const config = require('config');
const { logger } = require('../../lib/logger');

const initDB = async function () {
    try {
        const mongodbUrl = config.mongodb.url;
        schema.getMongooseConnection(mongodbUrl);
        await schema.createModels(mongodbUrl);
    } catch (ex) {
        logger.log({ level: 'error', message: ex.message });
    }
}

module.exports = { initDB };
