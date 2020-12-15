const {
    logger
} = require('./lib/logger');
const {
    startServer
} = require('./app');
const { initDB } = require('./utils/database');
async function setup() {
    try {

        await initDB();
        const { createServices } = require('./services/service-factory');
        const services = createServices();
        
        await startServer({
            services
        });
    } catch (error) {
        logger.log({
            level: 'error',
            message: `Failed to start server::::::::${error}`
        });
        console.log(error);
        process.exit(1);
    }
}

setup();