/*
    Email controller
    send:send an email from this email address (defined in ../configs/emailconfig.js)

    Created by UUNagato
 */

var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var config = require('../configs/emailconfig.js');
var validator = require('validator');

const emailjwtstr = 'emancipa2ed!#';

//
// Send email
// to: the destination address
// title: the title of email
// mainbody: main html text
// return: true for succeed, false for fail
var sendfunc = async function(to, title, mainbody) {
    // check if the mail address is right
    if(!validator.isEmail(to))
        return false;

    var transporter = nodemailer.createTransport(config.smtpConfig);
    await transporter.sendMail({
        from:config.senderEmail,
        to:to,
        subject:title,
        html:mainbody
    },function(err, info) {
        if(err) {
            console.log('Email send fault ' + err);
            return false;
        } else {
            console.log('Email send succeed:' + info.response);
            return true;
        }
    })

    return true;
};

//
// Generate Email validate token
// param: email, user_id
// return: token or null
var generateValidationCodefunc = function(mail, userid) {
    var payload = {
        email: mail,
        user_id: userid
    };

    var token = jwt.sign(payload, emailjwtstr, {expiresIn:'1 day'});
    return token;
}

//
// Validate Email validation code
// param: token
// return: user_id for the user or null
var validateEmailTokenfunc = function(token) {
    try{
        var decoded = jwt.verify(token, emailjwtstr);
        return decoded.user_id;
    } catch(err) {
        return null;
    }
}

module.exports = {
    send : sendfunc,
    generateValidationCode : generateValidationCodefunc,
    validateEmailToken : validateEmailTokenfunc
};