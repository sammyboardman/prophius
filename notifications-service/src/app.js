/* eslint unicorn/no-process-exit: 0 */
const config = require('config');
const Hapi = require('@hapi/hapi');
const { logger } = require('./lib/logger');
const { subscriber } = require('./utils/queue');
const constants = require('./utils/constant');


async function startServer({ services } = {}) {
    const server = new Hapi.Server(JSON.parse(JSON.stringify(config.server.connection)));
    server.app.services = services;
    await server.start();
    subscriber(constants.CreateUserQueue);
    subscriber(constants.DeleteUserQueue);
    logger.log({ level: 'info', message: `%s %s started on port ${server.info.port}` });
    return server;
}

module.exports = { startServer };
