var express = require('express');
var parser = require('body-parser');
var path = require('path');
var mysql = require('mysql');
var app = express();

//Body Parser Middlleware
app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());


app.use(function(req,res,next){
    res.locals.student_data = null;
    next();
});

//Setting Up EJS & views folder
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'app_views'));


require('./router')(app);

//Starting Server
app.listen(5000,function(){
    console.log('server running on port 5000');
});