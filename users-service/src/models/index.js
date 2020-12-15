const mongoose = require('mongoose');
const schemas = require('./getSchemas');
const connectionFactory = require('../utils/database/dbConnectionProxy');
mongoose.Promise = require('bluebird');
mongoose.set('useFindAndModify', false);

module.exports = {
  models: null,
  schemas,
  createModels,
  destroyModels,
  getMongooseConnection,
  allModels: {},
  mongoose,
};


function createModels(mongoURL) {
  if (!mongoURL || typeof mongoURL !== 'string') {
    return Promise.reject(new Error('You must provide a mongodb url.'));
  }

  const connection = connectionFactory.getInstance({
    connectionString: mongoURL,
    mongoose,
  });

  return connection.start(schemas)
    .then((allModels) => {
      module.exports.models = allModels;
      module.exports.mongoose = mongoose;
      module.exports.allModels[mongoURL] = allModels;
      return allModels;
    });
}

function destroyModels(target) {
  return connectionFactory.releaseInstance(target);
}

function getMongooseConnection(target) {
  return connectionFactory.getMongooseConnectionForInstance(target);
}
