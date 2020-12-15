const schema = require('./schema');
const mongooseIntlPhoneNumber = require('mongoose-intl-phone-number');
schema.plugin(require('../sharedPlugin'));
schema.plugin(mongooseIntlPhoneNumber, {
    hook: 'validate',
    phoneNumberField: 'mobile',
    nationalFormatField: 'nationalFormat',
    internationalFormat: 'internationalFormat',
    countryCodeField: 'countryCode',
});
module.exports = {
  schemaName : 'User',
  schema
};
