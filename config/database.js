const configAuth = require('./auth');
module.exports = {
    'url' : configAuth.mongoDB.url
}; 

/*
module.exports = {
    'url' : 'mongodb://localhost/myapp'
};

*/
