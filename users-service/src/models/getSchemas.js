const fs = require('fs');
const dirs = fs.readdirSync(`${__dirname}/schemas`);

module.exports = dirs.reduce((reduced, dirName) => {
  const { schema, schemaName } = require(`./schemas/${dirName}`);
  reduced[schemaName] = schema;
  return reduced;
}, {});
