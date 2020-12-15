const {
    logger
} = require('./lib/logger');
const {
    startServer
} = require('./app');
const { createServices } = require('./services/service-factory');

async function setup() {
    try {
        const services = createServices();
        await startServer({
            services
        });

    } catch (error) {
        logger.log({
            level: 'error',
            message: `Failed to start server::::::::${error}`
        });
        process.exit(1);
    }
}

setup();
