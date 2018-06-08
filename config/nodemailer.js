const nodemailer = require('nodemailer');
const configAuth = require('./auth');
var test = 'RANDOM!'
exports.signupMail = (sender, receiver, mailSubject, htmlBody) => {
    nodemailer.createTestAccount( (err, account) => {
        //Ethreal Email
        /*
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, 
            auth: {
                user: configAuth.ethereal.email,
                pass: configAuth.ethereal.password
            }
        }); */

        //Gmail
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                   user: configAuth.gmail.email,
                   pass: configAuth.gmail.password
            }
        });    
                
        let mailOptions = {
            from: sender,
            to: receiver, 
            subject: mailSubject,//'Signup successfull with Moglix Careers ✔',
            //text: 'Welcome to Moglix Careers !\n Your Signup was successfull !', 
            html: htmlBody
        };
    
        
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            else {
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            }    
        });
        
    });
}
