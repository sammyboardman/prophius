const schema = require('./schema');
schema.plugin(require('../sharedPlugin'));
module.exports = {
  schemaName : 'User',
  schema
};
