//after register, the user need to open the link that has been sent to his email
//and then validate this user_info

var validate_control = require('../controllers/emails.js');
var user_control = require('../controllers/users.js');
var userInfo = require('register.js');
var fs = require('fs');
var path = require('path');

//get the userInfo from register.js
var username = userInfo.username;
var password = userInfo.password;
var email = userInfo.email;
var userid = user_control.getUserId(username);

//go to the note page to note the user log in his email
var fn_notePage = async(ctx, next) => {
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream(path.join(__dirname,'../../dist/.html')); 
    await fn_validate; //send email
};

//sned email and validate
var fn_validate = async(ctx, next) => {
    let token = validate_control.generateValidationCode(email, userid);
    
    await validate_control.send(email,'Gems - 验证邮件',
    '<h3>尊敬的用户您好！</h3><h4>欢迎您注册GG账号，您可以通过我们的网站与世界各地的游戏开发者进行交流。</h4>'
    +'<a herf="' + token + '">验证</a>'
    +'<h4>请点击上方链接进行邮箱验证，验证成功即可正式注册账号。</h4>');
};

module.exports = {
    'GET /note' : fn_notePage,
};