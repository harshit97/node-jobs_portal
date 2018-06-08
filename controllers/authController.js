const path = require('path');
const md5 = require('md5');
const User = require('../models/user');
const nodemailerSend = require('../config/nodemailer');
var fs = require('fs');
var ejs = require('ejs');
var signup_email;
var currentInfo;
exports.Index = (req, res) => {
    res.redirect('/login');
};

exports.LoginPage = (req, res) => {
    res.render('login.ejs', {
        message: req.flash('loginMessage')
    });
};

exports.LoginGetEmail = (req, res) => {
    signup_email = req.body.email;
    console.log('Remember me Value : ');
    if (req.body.remember_me)
        res.cookie('rememberMe', signup_email, {
            maxAge: 1000 * 60 * 60 * 24
        });
    res.redirect('/profile');
}

exports.SignUpPage = (req, res) => {
    res.render('signup.ejs', {
        message: req.flash('signupMessage')
    });
};

exports.SignUpGetEmail = (req, res) => {
    signup_email = req.body.email;
    res.redirect('/signup/success');
}


exports.SignUpSuccess = (req, res) => {
    res.render('signup_success.ejs');
}

exports.SignUpDetails = (req, res) => {
    res.render('signup_details.ejs');
}

exports.getResumeUpload = (req, res) => {
    res.render('uploadResume.ejs');
}

exports.postResumeUpload = (req, res) => {
    //File Upload
    if (req.files.upfile) {
        var file = req.files.upfile,
            type = file.mimetype,
            name = file.name;

        file.name = signup_email + '_resume_' + file.name;
        name = file.name;
        console.log("\nResume Name : ", name);
        var uploadpath = path.join(__dirname, '../resume_uploads/') + name;
        file.mv(uploadpath, function (err) {
            if (err) {
                console.log("Resume Upload Failed", name, err);
            } else {
                console.log("Resume Uploaded", name);
            }
        });
    } else {
        console.log("No Resume selected !");
    }
    //UPDATE INFO
    var query = {
        'local.email': signup_email
    };
    User.findOne(query, (err, user) => {
        if (err)
            console.log("Error finding user in database (ResumeUpload) due to", err);
        else {
            console.log("Found user (ResumeUpload)", user);
            var updatedDetailsObject = {
                resume: {
                    resume_location: name
                }
            };

            User.findOneAndUpdate(query, updatedDetailsObject, {
                new: true
            }, function (err, doc) {
                if (err) {
                    console.log("Something wrong when updating user resume!");
                } else {
                    console.log("Resume Updated document : ", doc);
                }
            });
        }
    });

    res.redirect('/profile');
}

exports.SignUpDetailsSubmit = (req, res) => {

    //Save details in database
    var query = {
        'local.email': signup_email
    };

    User.findOne(query, (err, user) => {
        if (err)
            console.log("Error finding user in database (UpdateSignUp) due to", err);
        else {
            //console.log("Found user ", user);
            var updatedDetailsObject = {
                details: {
                    full_name: req.body.full_name,
                    gender: req.body.gender,
                    dateofbirth: req.body.dateofbirth,
                    city: req.body.city,
                    state: req.body.state,
                    zip_code: req.body.zip_code,
                    domain: req.body.domain,
                    position: req.body.position,
                    skills: req.body.skills,
                    experience: req.body.experience,
                    education: req.body.education
                }
            };

            User.findOneAndUpdate(query, updatedDetailsObject, {
                new: true
            }, function (err, doc) {
                if (err) {
                    console.log("Something wrong when updating user sign up details!");
                } else {
                    console.log("Updated document : ", doc);
                }
            });
        }
    });

    res.redirect('/profile');
}


exports.Profile = (req, res) => {
    //console.log("REQ uSE", req.user);
    res.cookie('lastUser', signup_email, {
        maxAge: 1000 * 60 * 60 * 24
    });
    if (req.user != null) {
        var temp = req.user.local;
        temp = JSON.stringify(temp);
        temp = JSON.parse(temp);
        signup_email = temp.email
    }
    console.log("In Auth Controller Prfile ", signup_email);

    var query = {
        'local.email': signup_email
    };
    User.findOne(query, (err, result) => {
        if (err)
            throw err;
        else {
            currentInfo = result;
            console.log(req.flash('profileMessage'));
            res.render('profile.ejs', {
                user: result
            })
            //console.log("The fetched user deatails are : \n", result);
        }
    });
};

exports.ProfileUpdate = (req, res) => {
    res.render('updateProfile.ejs', {
        user: currentInfo
    });
}

//-------------PROFILE UPDATE-------------------
exports.ProfileUpdatePost = (req, res) => {
    //UPDATE INFO
    var query = {
        'local.email': signup_email
    };
    User.findOne(query, (err, user) => {
        if (err)
            console.log("Error finding user in database (UpdateProfile) due to", err);
        else {
            //console.log("Found user (UPDATE)", user);
            var updatedDetailsObject = {
                details: {
                    full_name: req.body.full_name,
                    gender: req.body.gender,
                    dateofbirth: req.body.dateofbirth,
                    city: req.body.city,
                    state: req.body.state,
                    zip_code: req.body.zip_code,
                    domain: req.body.domain,
                    position: req.body.position,
                    skills: req.body.skills,
                    experience: req.body.experience,
                    education: req.body.education
                }
            };



            User.findOneAndUpdate(query, updatedDetailsObject, {
                new: true
            }, function (err, doc) {
                if (err) {
                    console.log("Something wrong when updating user sign up details!");
                } else {
                    //---------NODEMAILER PROFILE UPDATE EMAIL---------------
                    var compiled = ejs.compile(fs.readFileSync(__dirname + '/profileUpdateEmail.ejs', 'utf8'));
                    var html = compiled({
                        user: doc
                    });
                    var htmlBodyToSend = html;
                    var mailSubject = 'Moglix : Profile Updated !✔';
                    console.log("----------HTML FILE------------", htmlBodyToSend);
                    nodemailerSend.signupMail('"Harshit Agarwal" <harshit.agarwal@moglix.com>', signup_email, mailSubject, htmlBodyToSend);
                    //---------------------------------------------------------
                    console.log("Updated document : ", doc);
                }
            });
        }
    });

    res.redirect('/profile');
}

exports.getPhotoUpload = (req, res) => {
    res.render('uploadPicture.ejs');
}

exports.postPhotoUpload = (req, res) => {
    //File Upload
    if (req.files.upfile) {
        var file = req.files.upfile,
            type = file.mimetype,
            name = file.name;

        file.name = signup_email + '_profile_img_' + file.name;
        name = file.name;
        console.log("\nPicture Name : ", name);
        var uploadpath = path.join(__dirname, '../public/profile_pictures/') + name;
        file.mv(uploadpath, function (err) {
            if (err) {
                console.log("Image Upload Failed", name, err);
            } else {
                console.log("Image Uploaded", name);
            }
        });
    } else {
        console.log("No Image selected !");
    }
    //UPDATE INFO
    var query = {
        'local.email': signup_email
    };
    User.findOne(query, (err, user) => {
        if (err)
            console.log("Error finding user in database (ImageUpload) due to", err);
        else {
            console.log("Found user (ImageUpload)", user);
            var updatedDetailsObject = {
                picture: {
                    profile_picture_name: name
                }
            };

            User.findOneAndUpdate(query, updatedDetailsObject, {
                new: true
            }, function (err, doc) {
                if (err) {
                    console.log("Something wrong when updating user profile picture!");
                } else {
                    console.log("Profile Pic Updated document : ", doc);
                }
            });
        }
    });

    res.redirect('/profile');
}

exports.getForgotPassword = (req, res) => {
    res.render('forgot.ejs', {
        message: ''
    });
}

exports.postForgotPassword = (req, res) => {
    var newUser = new User();
    var newPass = newUser.generateHash(req.body.password);
    console.log("New password : ", newPass);
    var query = {
        'local.email': req.body.email
    };
    User.findOne(query, (err, result) => {
        if (err)
            throw err;
        else {
            if (result == null)
                res.render('forgot.ejs', {
                    message: "User not found !",
                    message2: ""
                });
            else {
                console.log("User Details ", result);

                var updatedObject = {
                    local: {
                        email: req.body.email,
                        password: newPass,
                    }
                }
                User.findOneAndUpdate(query, updatedObject, {
                    new: true
                }, function (err, doc) {
                    if (err) {
                        console.log("Something wrong when updating data!");
                    } else {
                        console.log("Updated document : ", doc);
                        res.render('forgot.ejs', {
                            message: "Password updated successfully!",
                            message2: "Click here to login"
                        });
                    }
                });
            }
        }
    });
}

exports.Logout = (req, res) => {
    req.logout();
    res.redirect('/');
}

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

exports.redirectIfLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        res.redirect('/profile');
    else
        return next();
}