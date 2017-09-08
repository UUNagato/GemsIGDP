var register_control = require('../controllers/users.js');
var fs = require('fs');
var path = require('path');

//to load register page
var fn_register = async(ctx, next) => {
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream(path.join(__dirname,'../../dist/register.html')); 
};

//to test userid is repeat or not
var fn_testId = async(ctx, next) => {
    var name = ctx.request.body.name || '';
    let repeat = await register_control.userCheck(name);
    
    
    if(repeat === true)
        ctx.response.body = 'fail';
    else
        ctx.response.body = 'success';
};


//global variable, then can export these variables, then be convenient to finish later functions
var name = '';
var password = '';
var email = '';

//to get register info and insert into the login_info table
var fn_getInfo = async(ctx, next) => {
    name = ctx.request.body.username || '';
    email = ctx.request.body.email || '';
    password = ctx.request.body.password || '';

    let insert = await register_control.registerAUser(name, password, email);
    console.log('insert to database:'+insert);
};

module.exports = {
    'GET /register' : fn_register,
    'POST /register/checkId': fn_testId,
    'POST /register/upInfo' : fn_getInfo,
    user_name : name,
    password : password,
    email : email
};