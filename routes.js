const authController = require('./controllers/authController');
module.exports = function(app, passport) {

    module.exports.passport;

    app.get('/', authController.redirectIfLoggedIn, authController.Index);
    
    app.get('/login', authController.redirectIfLoggedIn, authController.LoginPage);
    
    app.post('/login', passport.authenticate('local-login', {
        failureRedirect : '/login', 
        failureFlash : true 
    }),authController.LoginGetEmail);
    
    app.get('/signup', authController.redirectIfLoggedIn, authController.SignUpPage);

    app.post('/signup', passport.authenticate('local-signup', {
        failureRedirect : '/signup', 
        failureFlash : true 
    }),authController.SignUpGetEmail);

    app.get('/signup/success', authController.SignUpSuccess);

    app.get('/signup/details', authController.SignUpDetails);

    app.post('/signup/details', authController.SignUpDetailsSubmit);

    //Profile Routes
    app.get('/profile', authController.isLoggedIn, authController.Profile);
    app.get('/profile/update', authController.isLoggedIn, authController.ProfileUpdate);
    app.post('/profile/update', authController.isLoggedIn, authController.ProfileUpdatePost);

    //Photo Upload Route
    app.get('/profile/uploadPicture', authController.isLoggedIn, authController.getPhotoUpload);
    app.post('/profile/uploadPicture', authController.isLoggedIn, authController.postPhotoUpload);
    /*app.post('/profile/uploadPicture', authController.isLoggedIn, upload.single('avatar'), (req, res) => {
        console.log("------------\n", req.file);
    });*/

    //Logout Route
    app.get('/logout', authController.Logout);

    //Forgot Password Routes
    app.get('/forgotPassword', authController.getForgotPassword);
    app.post('/forgotPassword', authController.postForgotPassword);


    //Google Authentication Routes
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));

    //Linkedin Authentication Routes
    app.get('/auth/linkedin', passport.authenticate('linkedin'));
    app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));
};

