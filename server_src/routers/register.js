var controllers = require('../controllers/users.js');
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
    let repeat = await controllers.userCheck(name);
    
    
    if(repeat === true)
        ctx.response.body = 'fail';
    else
        ctx.response.body = 'success';
};

module.exports = {
    'GET /register' : fn_register,
    'POST /register/checkId': fn_testId
};