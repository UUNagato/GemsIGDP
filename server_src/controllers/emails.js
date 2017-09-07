/*
    Email controller
    send:send an email from this email address (defined in ../configs/emailconfig.js)

    Created by UUNagato
 */

var nodemailer = require('nodemailer');
var config = require('../configs/emailconfig.js');
var validator = require('validator');

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

module.exports = {
    send : sendfunc
};