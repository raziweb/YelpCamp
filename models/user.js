const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

userSchema.plugin(passportLocalMongoose); //adds username and password to the schema, ensures username are unique, hashes the passwords

const User = mongoose.model('User', userSchema);
module.exports = User;