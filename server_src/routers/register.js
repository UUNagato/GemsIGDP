var controllers = require('../controllers/users.js');

//to load register page
var fn_register = async(ctx, next) => {
    ctx.response.redirect('/register.html');
};

//to test userid is repeat or not
var fn_testId = async(ctx, next) => {
    var name = ctx.request.body.name || '';
    let repeat = controllers.userCheck(name);
    if(repeat == true)
        ctx.response.body = 'fail';
    else
        ctx.response.body = 'success';
};

module.exports = {
    'GET /register' : fn_register,
    'POST /register': fn_testId
};