const config = require('config');
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const { logger } = require('./lib/logger');
const packageJson = require('../package.json');

async function startServer({ services, appPackage = packageJson } = {}) {
    const server = new Hapi.Server(JSON.parse(JSON.stringify(config.server.connection)));
    server.app.services = services;
    if (config.swagger.active) {
        await server.register([
            Inert,
            Vision,
            {
                plugin: HapiSwagger,
                options: {
                    host: process.env.PLUTO_SWAGGER_HOST || config.swagger.host,
                    info: {
                        title: `${appPackage.name} Documentation`,
                        description: appPackage.description,
                        version: appPackage.version,
                    },
                    basePath: '/v1/',
                    grouping: 'tags',
                    schemes: ['http', 'https'],
                },
            },
        ]);
    }

    await server.start();
    logger.log({ level: 'info', message: `%s %s started on port ${server.info.port}` });
    
    return server;
}

module.exports = { startServer };
