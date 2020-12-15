const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    mobile: {
        type: String,
        required: true
    },
});
