// server/models/user.js
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema(
    {
    createdAt: {
        type: Date,
        default: Date.now
    }
    },
    { timestamps: true }
);

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
