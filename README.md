# Node Profile & Jobs Portal

 - This project includes a fully functioning login page with conventional sign in & sign up functionality along with social login via Google & LinkedIn.
 - MVC guidlines and folder structure is followed.
 - Users details are stored in a MongoDB document with separate objects for login info and profile details.
 - Passwords are hashed and then stored in the database.
 - User has the option to upload his resume and profile picture in all major document and image formats.
 - Redis caching has been implemented for user's profile details for faster loading of the profile page.
 - There is a jobs listing page where the user browse and search for jobs. Each job has tags associated with it for faster search.
 - Users have the option to update their profile anytime they want.
 - Users are sent emails on successfull sign up and profile updation.

### Tech
This project uses a number of open source npm packages and projects to work properly, some of the major ones are listed below :

* [ExpressJS](https://expressjs.com) - Fast NodeJS network app framework.
* [PassportJS](http://www.passportjs.org/) - Express-compatible simple authentication middleware for NodeJS.
* [mongoose](https://www.npmjs.com/package/mongoose) - MongoDB object modeling tool designed to work in an asynchronous environment.
* [Bootstrap 4](https://getbootstrap.com/) - Great UI boilerplate for modern web apps.
* [Redis for NodeJS](https://www.npmjs.com/package/redis) - Complete and feature rich Redis client for node.js. It supports all Redis commands and focuses on high performance.
* [Nodemailer](https://nodemailer.com/about/) - Module for Node.js applications to allow easy as cake email sending.
* [Embedded JavaScript(EJS)](http://ejs.co/) - Embedded JavaScript templates.

### Installation

The project requires [Node.js](https://nodejs.org/) v8+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ npm install 
$ node app.js
```
