'use strict'
var user_control = require('../controllers/users.js');
var validate_control = require('../controllers/emails.js');
var fs = require('fs');
var path = require('path');


//check login_info
var userchecker = /^[a-zA-Z0-9_]{6,18}$/;
var emailchecker = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
var passchecker = /[^><\s]{6,18}/;


//to load register page
var fn_register = async(ctx, next) => {
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream(path.join(__dirname,'../../dist/register.html')); 
};

//to test userid is repeat or not
var fn_testId = async(ctx, next) => {
    var name = ctx.request.body.name || '';
    let repeat = await user_control.userCheck(name);
    
    
    if(repeat === true)
        ctx.response.body = 'fail';
    else
        ctx.response.body = 'success';
};



//to get register info and insert into the login_info table, and then send email
var fn_getInfo = async(ctx, next) => {
    var name = ctx.request.body.username || '';
    var email = ctx.request.body.email || '';
    var password = ctx.request.body.password || '';

    //check user_info
    var queryBody = {};
    // should get a post request
    if(ctx.request.body.username) {
        // use username to login
        // check username
        if(!userchecker.test(ctx.request.body.username)) {
            // error
            ctx.body = {error:0};//the username error
            return;
        }
        queryBody['user_name'] = ctx.request.body.username;

    } 
    if (ctx.request.body.email) {
        if(!emailchecker.test(ctx.request.body.email)) {
            ctx.body = {error:1}; //the email error
            return;
        }
        queryBody['email'] = ctx.request.body.email;
    }

    // check password
    if(!passchecker.test(ctx.request.body.password)) {
        ctx.body = {error:2}; //the password error
        return;
    }


    //insert a user into the user_info and login_info table
    let insert = await user_control.registerAUser(name, password, email);
    
    if(insert != null)
    {
        //send email
        //var userid = await user_control.getUserId(name);
        let token = validate_control.generateValidationCode(email, insert);
        
        let success = await validate_control.send(email,'Gems - 验证邮件',
        '<h3>尊敬的用户您好！</h3><h4>欢迎您注册GG账号，您可以通过我们的网站与世界各地的游戏开发者进行交流。</h4>'
        +'<h3>http://127.0.0.1/register/emailvalidate/' + email + '/' + token +'</h3>'
        +'<h4>请点击上方链接进行邮箱验证，验证成功即可正式注册账号。</h4>');

        //!!!test!!!!!!!!!!!!!
        /*let success = await validate_control.send(email,'Hello',
        '<h1>尊敬的用户您好！</h1>');*/

        console.log('send success : '+ success);
        ctx.response.body = '/register/inform';
    }
    else
        ctx.response.body = {error : 4};//cannot send email error
};


//go to the note page to note the user log in his email
var fn_notePage = async(ctx, next) => {
    //await fn_send(ctx,next); //send email
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream(path.join(__dirname,'../../dist/inform.html')); 
};


//after validate, through validate_control know the userid
var fn_getReturnId = async(ctx, next) => {
    let token = ctx.params.token;
    let email = ctx.params.email;
    
    //click the validate link and return an id
    let returnId = validate_control.validateEmailToken(token);
    //!!!!!!!!!!!!!!!test!!!!!!!!!!!!!!!!!
    console.log('return id : '+returnId);
    //console.log('email: '+email);

    
    //active the user's email
    try{
        await user_control.activeUserEmail(email,returnId);
    }catch(error){
        console.log('active a email, some errors happen:'+error);
    }

    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream(path.join(__dirname,'../../dist/informReturn.html')); 
};



module.exports = {
    'GET /register' : fn_register,
    'POST /register/checkId': fn_testId,
    'POST /register/upInfo' : fn_getInfo,
    'GET /register/inform' : fn_notePage,
    'GET /register/emailvalidate/:email/:token' : fn_getReturnId
};