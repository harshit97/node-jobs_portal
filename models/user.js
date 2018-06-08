var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
const md5 = require('md5');
var userSchema = mongoose.Schema({
    local : {
        email : String,
        password : String,
    }, 
    google : {
        id : String,
        token : String
    },
    linkedin : {
        id : String,
        token : String
    },
    details : {
        full_name : String,
        gender: String, 
        dateofbirth : String, 
        city : String,
        state : String, 
        zip_code : String,
        domain : String,
        position : String,
        skills : String, 
        experience : String,
        education : String,
    },
    picture : {
        profile_picture_name : String
    },
    resume : {
        resume_location : String
    }
});

// Generating Password Hash
/*
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Check Password
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
}; */

userSchema.methods.generateHash = function(password) {
    return md5(password);
};

// Check Password
userSchema.methods.validPassword = function(password) {
    return (md5(password) == this.local.password);
};


module.exports = mongoose.model('User', userSchema);