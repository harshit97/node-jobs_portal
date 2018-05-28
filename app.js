const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const fileupload = require('express-fileupload');
const path = require('path');

const app = express();
const port = process.env.PORT || 4000;

//Connecting to MongoDB Atlas Cluster 
var configDB = require('./config/database.js');
const options = { reconnectTries: Number.MAX_VALUE, poolSize: 10, useMongoClient: true };  
mongoose.connect(configDB.url, options, (error) => {
    if (error)
      console.log("Error in connection due to : ", error);
    else
      console.log("Connected to MongoDB Cluster !\n");
});

// Passing passport for configuration
require('./config/passport')(passport);

// Logs every request to the console
app.use(morgan('dev')); 

// Reads cookies (needed for authentication)
app.use(cookieParser()); 

//Body Parser Middlleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 

// FileUpload
app.use(fileupload());

//Setting EJS as the view engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

// Passport Sessions
app.use(session({secret: 'secret', saveUninitialized: true, resave: true})); 
app.use(passport.initialize());
app.use(passport.session()); 

//Flash Messages
app.use(flash());


//Setting Static Folder
app.use(express.static(path.join(__dirname, 'public')));


// Passing express app variable and passport configurations 
require('./routes')(app, passport);

// Server
app.listen(port, () => {
    console.log('Server started on : ' + port);
});

