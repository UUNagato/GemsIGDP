/*
    User module.
    deal with user database update,query
    deal with register and log in
    
    password using MD5 and log in use JWT

    2017/9/6 created by UUNagato
    2017/9/9 modify register return value, add findIdbyUsername method.
    2017/9/12 add some CSRF defense method.
 */
'use strict'

// database model
var models = require('../models');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
const jwtstr = require('../configs/jwtconfig.js');
const csrfstr = require('../configs/csrfconfig.js');

var currentUser = null;


//check if the user_name is repeat in the login_info table or not
//if repeat return true
var userNameCheckfunc = async function(username) {
    var loginfo = await models.login.findOne({
        where:{
            user_name : username
        }
    });

    if(loginfo === null)
        return false;
    else
    {
        console.log('the user is already exist.');
        return true;
    }
};

//to get user_id, param:username
/*var getUserIdfunc = async function(username) {
    models.login.findOne({
        where: {
            user_name : username
        }
        }).then(user =>{
            return user.user_id;
    });
};*/

// 
// check if the user's login data is correct.
//
// param: username, pw:password
// return: true:the user info is correct; false:not correct
var loginCheckfunc = async function(username, pw) {
    // try to find user
    var loginfo = await models.login.findOne({
        where:{
            user_name : username,
        }
    });

    if(loginfo === null)
        return false;

    let md5 = crypto.createHash('md5');
    
    // chekc password
    md5.update(pw);
    if(loginfo.password === md5.digest('hex')) {
        return true;
    }
    return false;
};

//
// Login, this is used to login a user and return its token.
// param:
// userinfo:the login used info, userinfo.user_name or userinfo.email
// pwd: unencrypted password
// return:token string if succeed, else return null
//
var tryLoginfunc = async function(userinfo, pwd) {
    // chekc if the login info is true
    var loginInfo = await models.login.findOne({
        where: userinfo
    });

    // no such a user
    if(loginInfo === null)
        return null;

    // user exists, try password
    let md5 = crypto.createHash('md5');
    md5.update(pwd);
    let encryptedPwd = md5.digest('hex');
    if(loginInfo.password === encryptedPwd) {
        // true user, generate token.
        return ({
            token:generateUserTokenfunc(loginInfo.user_id,loginInfo.user_name),
            csrf:generateCSRFtokenfunc(loginInfo.user_id)
        })
    }

    return null;
}

//
// login token generator
// param:
// userid: id of user
// username: name of user
// return: the token
var generateUserTokenfunc = function(userid, username) {
    var payload = {
        generate_time : Date.now(),
        user_id: userid,
        user_name: username
    };

    var jwtresult = jwt.sign(payload, jwtstr,{expiresIn: '15 days'});
    return jwtresult;
}

//
// check if user is exist
// param: userinfo
// userinfo.username : username
// userinfo.nickname : nickname
// {username:xxx}
// return: true is already exist, false for not
var userExistfunc = async function(userinfo) {
    let ret = false;

    if(typeof userinfo.username === 'string') {
        var user = await models.login.findOne({
            where:{
                user_name: userinfo.username
            }
        });
            
        return (user !== null);
    }

    if(typeof userinfo.nickname === 'string') {
        var user = await models.user.findOne({
            where:{
                nickname: userinfo.nickname
            }
        });
            
        return (user !== null);
    }
    return false;
}

// 
// add a basic user to database
// there may be collision
// param:
// return: user_id or null
var registerAUserfunc = async function(username, pwd, eml) {
    // try to insert
    try {
        var userrel = await models.user.create({
            nickname:username,
            register_time: new Date(),
            lastlogin_time: new Date(),
            age: 0,
            sex:'male'
        });
        // insert login info
        let md5 = crypto.createHash('md5');
        md5.update(pwd);
        var cryptopwd = md5.digest('hex');
        var loginrel = await models.login.create({
            user_id:userrel.id,
            user_name:username,
            email:eml,
            password:cryptopwd
        });

        return userrel.id;

        // succeed!
    } catch(err) {
        console.log(err);
        return null;
    }
}

//
// find user id by user name
// param:username
// return: user_id or null
var findUserIdByUserNamefunc = async function(username) {
    var refuser = await models.login.findOne({
        attributes:['user_id'],
        where:{
            user_name: username
        }
    });

    if(refuser !== null) {
        return refuser.user_id;
    }

    return null;
}

//
// login status check middleware
// check if that's a logged in user
var userTokenMiddleware = async function(ctx, next) {
    // try to get token
    var token = ctx.cookies.get('authentication') || ctx.request.body.token || ctx.request.query.token || ctx.request.headers['x-access-token'];
    // emptp current user
    currentUser = null;

    if(token) {
        // token exists
        try {
            var decoded = jwt.verify(token, jwtstr);
            currentUser = decoded;
            console.log('log in!');
        } catch(err) {
            return null;
        }
    }

    // next middleware
    await next();
};

//
// Get current user
// return: current user
// {
// user_id,
// user_name
// }
var getCurrentUserfunc = function() {
    return currentUser;
}

//
// Active Email
// param: id - user id
// return: void for succeed or throw an error.
var activeUserEmailfunc = async function(email, user_id) {
    // first find this user
    var user = await models.user.findOne({
        attributes: ['id','authority'],
        where: {
            id: user_id,
            authority: 0
        }
    });

    var loginInfo = await models.login.findOne({
        attributes: ['email'],
        where: {
            id: user_id
        }
    });

    if(user === null)
        throw 'No such unactived user.';

    if(loginInfo.email !== email)
        throw 'incorrect email';
    
    try{
        await user.update({
            authority: 1
        });
    } catch(err) {
        throw 'failed to update data';
    }
}

//
// Generate CSRF token
// this token only passed to get some authentication operation.
// this will pass in the header
// param: user_id
// 
var generateCSRFtokenfunc = function(userid) {
    var date = new Date();
    var iatime = Math.floor(date.getTime() / 1000);

    var payload = {
        iss:'GemsIndividualGameMakersPlatform',
        iat:iatime,
        exp:iatime + 15 * 24 * 3600,
        user_id:userid
    };

    return jwt.sign(payload, csrfstr);
}

//
// Validate CSRF token
// context.request
// return true for succeed, false for not
//
var validateCSRFtokenfunc = function(req) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token) {
        try{
            jwt.verify(token, csrfstr);
            return true;
        } catch(err) {
            return false;
        }
    } else {
        return false;
    }
}

//
// Get the userinfo after login and CSRF validation
// param request
// 
var getValidatedUserfunc = function(req) {
    if(currentUser !== null && validateCSRFtokenfunc(req)) {
        return currentUser;
    } else {
        return null;
    }
}

//get the userinfo by id
var getUserByIdfunc = async function(id) {
    var user = await models.user.findOne({
        attributes: ['nickname', 'telephone','qq','birthday','profile', 'sex','github','personal_web','signature'],
        where:{
            id : id
        }
    });

    return user;
};


//update some user info in the user_info table
//use for modify the info in the individual page
//params: the user object
//return true for update success or false for not
var modifyUserInfofunc = async function(user) {
    try{
        await models.user.update(user,
            {where:{
                id : 1 //for test!!!!!!
            }
        });
    }catch(error){
        console.log('update user_info, errors happen: '+error);
        return false;
    }

    console.log('update user_info success!!!');//!!!!!!!!test!!!!!!!!!!!!!
    return true;
}

module.exports = {
    userCheck : userNameCheckfunc,
    loginCheck : loginCheckfunc,
    userExist : userExistfunc,
    registerAUser : registerAUserfunc,
    tryLogin : tryLoginfunc,
    getCurrentUser : getCurrentUserfunc,
    findUserIdByUserName : findUserIdByUserNamefunc,
    generateCSRFtoken : generateCSRFtokenfunc,
    validateCSRFtoken : validateCSRFtokenfunc,
    activeUserEmail : activeUserEmailfunc,
    getUserById : getUserByIdfunc,
    modifyUserInfo : modifyUserInfofunc,
    getValidatedUser : getValidatedUserfunc,

    middleware: userTokenMiddleware
};