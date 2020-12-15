let timestamps = require('./timestamps'),
    modified = require('./modified');

module.exports = function( schema, options ) {
  modified.apply(this, arguments);
  timestamps.apply(this, arguments);

};