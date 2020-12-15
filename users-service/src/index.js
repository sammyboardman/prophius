const {
    logger
} = require('./lib/logger');
const {
    startServer
} = require('./app');

async function setup() {
    try {
       
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
        process.exit(1);
    }
}

setup();