const { logger } = require('../src/lib/logger');

jasmine.getEnv().addReporter({
    specStarted(result) {
        if (result.status === 'disabled' || result.pendingReason) return; 
        logger.log({ level: 'info', message: `=== Starting spec "${result.fullName}" ===` });
    },

    specDone(result) {
        if (result.status === 'disabled' || result.pendingReason) return; 
        logger.log({ level: 'info', message: `Spec ${result.status}: ${result.fullName}` });
        for (const failedExpectation of result.failedExpectations) {
            logger.log({ level: 'info', message: failedExpectation.message });
            logger.log({ level: 'info', message: failedExpectation.stack });
        }
    },
});
