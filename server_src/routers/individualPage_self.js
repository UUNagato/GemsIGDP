var user_control = require('../controllers/users.js');
var fs = require('fs');
var path = require('path');


//init individualPage
var fn_initPage = async(ctx,next) => {
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream(path.join(__dirname,'../../dist/individualPage.html')); 
};


//get the personal info and update in the user table
var fn_updateUserInfo = async(ctx,next) => {
   // if( user_control.validateCSRFtoken(ctx.request) === true)
   // {
        var name = ctx.request.body.name || '';
        var sex = ctx.request.body.sex || '';
        var birthday = ctx.request.body.birthday || '';
        var qq = ctx.request.body.qq || '';
        var telephone = ctx.request.body.phone || '';
        var github = ctx.request.body.githubLink || '';
        var personalWeb = ctx.request.body.personalWeb || '';
        var sign = ctx.request.body.sign || '';

        if( sex === '男' )
            sex = 'male';
        else
            sex = 'female';

        //birthday format : yyyy-mm-dd, construct with new Date(y,m,d)
        var s = birthday.split('-');
        let year = s[0];
        let month = s[1];
        let day = s[2];
        var date = new Date(year,month,day);

        var user = {
            nickname : name,
            telephone : telephone,
            qq : qq,
            birthday : date,
            sex : sex,
            github : github,
            personal_web : personalWeb,
            signature : sign
        };

        let result = await user_control.modifyUserInfo(user);
        
        if(result === true)
            ctx.response.body = 'success!';
        else
            ctx.response.body = 'fail to modify, please try again.';

   /* }
    else{
        ctx.response.body = 'have no right to modify info!';
    }*/
    
    
};


module.exports = {
    'GET /idPage' : fn_initPage,
    'POST /idPage/modifyInfo' : fn_updateUserInfo
};