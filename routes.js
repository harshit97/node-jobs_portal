const authController = require('./controllers/authController');
const jobsController = require('./controllers/jobsController');
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

    //Resume Upload Route
    app.get('/profile/uploadResume', authController.isLoggedIn, authController.getResumeUpload);
    app.post('/profile/uploadResume', authController.isLoggedIn, authController.postResumeUpload);

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


    //Jobs Routes
    app.get('/jobs', jobsController.Index);
    app.post('/post_new_job', jobsController.PostNewJob);
    app.get('/all_jobs/:page_no', jobsController.ShowAllJobs);
    app.post('/find_jobs', jobsController.FindJobs);
    app.get('/job/:id', jobsController.FindSpecificJob);

};


