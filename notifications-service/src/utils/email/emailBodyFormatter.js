const config = require('config');
const constants = require('../constant');

module.exports = (payload, subject) => {
    let message;
    payload = JSON.parse(payload);
    if(subject === constants.UserCreationSubject){
        message = `<h3> Hi ${payload.lastname},</h3> <br/> Your account was created successfully. <br/> Regards. <br/> Prohius Team`;
    }else if(subject === constants.DeleteUserSubject){
        message = `<h3> Hi ${payload.lastname},</h3> <br/> Your account was deleted successfully <br/> Regards. <br/> Prohius Team`;
    }
   return {
        from: config.mail.from,
        to: payload.email,
        subject: subject,
        html: message
    };

}