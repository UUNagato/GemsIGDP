var user_control = require('../controllers/users.js');
var nunjucks_control = require('../controllers/nunjucks.js');
var article_control = require('../controllers/articles.js');
var fileManager = require('../controllers/filemanager.js');
var fs = require('fs');
var path = require('path');


//init individualPage
var fn_initPage = async(ctx,next) => {
    let id = parseInt(ctx.params.id);
    let currentUser = user_control.getCurrentUser();
    let result = await user_control.getUserById(id);
    let headPic = await user_control.getHeadPic(id);
    let aresults = await article_control.getUserArticles(id);
    var articles = new Array();
    var i;

    var user = {
        nickname : result.nickname,
        profile : headPic,
        sex : result.sex,
        profile : headPic,
        birthday : result.birthday,
        qq : result.qq,
        phone : result.telephone,
        github : result.github,
        personalWeb : result.personal_web,
        sign : result.signature
    };

    for(i in aresults)
    {
        articles[i] = {
            title : aresults[i].title,
            content : aresults[i].content||''
        };
        console.log('articles:'+aresults[i].title);
    }

    //render
    var s;
    if( id === currentUser.user_id )
    {
        s = await nunjucks_control.env.render('individualPage.html',{user:user, articles:articles});//idPage-self
    }
    else
        s = await nunjucks_control.env.render('idPageOther.html',{user:user, articles:articles});//idPage-other
    
    ctx.response.body = s;
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


//modify profile
var fn_updateProfile = async(ctx, next) => {
    var user = user_control.getValidatedUser(ctx.request);
    if(user !== null) {
        var file = ctx.request.body.files.file;
        try {
            var obj = await fileManager.imageUploadGetFile(user.user_id, file);
            await user_control.modifyHeadPic(user.user_id, obj.file_id);
            ctx.response.body = {url:obj.file_path};
        } catch(err) {
            ctx.response.body = {error:err.message};
        }
    } else {
        ctx.response.body = {error:'非合法用户'};
    }
};

module.exports = {
    'GET /idPage/:id' : fn_initPage,
    'POST /idPage/modifyInfo' : fn_updateUserInfo,
    'POST /upload/profileupload' : fn_updateProfile
};