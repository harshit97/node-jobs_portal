const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
var User = require('../models/user');
const configAuth = require('./auth');
const nodemailerSend = require('./nodemailer');
module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });


    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {

            process.nextTick(function () {

                User.findOne({
                    'local.email': email
                }, function (err, user) {

                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        // Writing to MongoDB database
                        var newUser = new User();
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            else {
                                var mailSubject = 'Moglix : Sign up successfull !✔';
                                var htmlBodyToSend = '<b><u></u>Welcome to Moglix Careers !</u><br>Your Signup was successfull!</b>';
                                nodemailerSend.signupMail('"Harshit Agarwal" <harshit@moglix.com>', email, mailSubject, htmlBodyToSend);
                                return done(null, newUser);
                            }

                        });
                    }
                });
            });
        }));



    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {


            User.findOne({
                'local.email': email
            }, function (err, user) {

                if (err)
                    return done(err);

                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));

                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Wrong password !'));

                return done(null, user);
            });

        }));


    // Gooogle Authentication
    passport.use(new GoogleStrategy({
            clientID: configAuth.googleAuth.clientID,
            clientSecret: configAuth.googleAuth.clientSecret,
            callbackURL: configAuth.googleAuth.callbackURL,
        },
        function (accessToken, refreshToken, profile, done) {

            process.nextTick(function () {

                User.findOne({
                    'google.id': profile.id
                }, function (err, user) {
                    if (err)
                        return done(err);
                    else if (user)
                        return done(null, user);
                    else {

                        var newUser = new User();

                        newUser.google.id = profile.id;
                        newUser.google.token = accessToken;
                        newUser.local.email = profile.emails[0].value;
                        newUser.details.full_name = profile.displayName;

                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });

        }));


    // LinkedIn Authentication    
    passport.use(new LinkedInStrategy({
            clientID: configAuth.linkedinAuth.clientID,
            clientSecret: configAuth.linkedinAuth.clientSecret,
            callbackURL: configAuth.linkedinAuth.callbackURL,
            scope: ['r_emailaddress', 'r_basicprofile'],
            state: true
        },
        function (accessToken, refreshToken, profile, done) {

            process.nextTick(function () {

                User.findOne({
                    'linkedin.id': profile.id
                }, function (err, user) {
                    if (err)
                        return done(err);
                    else if (user)
                        return done(null, user);
                    else {

                        var newUser = new User();

                        newUser.linkedin.id = profile.id;
                        newUser.linkedin.token = accessToken;
                        newUser.local.email = profile.emails[0].value;
                        newUser.details.full_name = profile.displayName;

                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));

};