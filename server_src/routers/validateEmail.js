//after register, the user need to open the link that has been sent to his email
//and then validate this user_info
/*
var validate_control = require('../controllers/emails.js');
var user_control = require('../controllers/users.js');
var userInfo = require('/opt/gitProject/GemsIGDP/server_src/routers/register.js');
var fs = require('fs');
var path = require('path');

//get the userInfo from register.js
var username = userInfo.username;
var password = userInfo.password;
var email = userInfo.email;


//sned email
var fn_send = async(ctx, next) => {
    ///test!!!!!!!!!!!!!
    console.log('userInfo : name = '+ username +',pw='+password+'email='+email);

    var userid = await user_control.getUserId(username);

    let token = validate_control.generateValidationCode(email, userid);
    
    let success = await validate_control.send(email,'Gems - 验证邮件',
    '<h3>尊敬的用户您好！</h3><h4>欢迎您注册GG账号，您可以通过我们的网站与世界各地的游戏开发者进行交流。</h4>'
    +'<a herf="' + token + '">验证</a>'
    +'<h4>请点击上方链接进行邮箱验证，验证成功即可正式注册账号。</h4>');

    console.log('send success : '+ success);
};


//go to the note page to note the user log in his email
var fn_notePage = async(ctx, next) => {
    //await fn_send(ctx,next); //send email
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream(path.join(__dirname,'../../dist/inform.html')); 
};


//validate user
var fn_validate = async(ctx, next) => {
    var userid = await user_control.getUserId(username);

    let returnId = validate_control.validateEmailToken(token);
    if(returnId === userid)
        return true;
    else
        return false;
};

module.exports = {
    'GET /inform' : fn_notePage,
    fn_validate : fn_validate
};*/