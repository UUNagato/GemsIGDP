/*
    router : to use the ewindow controller to show windows in page
    or release a exhibition window
*/

var fs = require('fs');
var path = require('path');
var ewindow_control = require('../controllers/ewindows.js');
var nunjucks_control = require('../controllers/nunjucks.js');
var users = require('../controllers/users.js');


//init the display.html
var fn_initListPage = async(ctx, next) => {
    var results = await ewindow_control.getExhibitionList();

    //render
    var s  = nunjucks_control.env.render('display.html', {items : results});
    ctx.response.body = s;
};


//init the display_detail.html
var fn_initDetailPage = async(ctx, next) => {
    let id = parseInt(ctx.params.id);
    let result = await ewindow_control.getAEWindow(id);


    //render
    var s = nunjucks_control.env.render('display_detail.html', {ewindow:result.ewindow, files:result.files});
    ctx.response.body = s;
};

// used to post new exhibition window
var fn_postNew = async(ctx, next) => {
    let user = users.getValidatedUser(ctx.request);
    if(user !== null) {
        var title = ctx.request.body.title;
        var description = ctx.request.body.description;
        var imgs = ctx.request.body.imgs;

        // try to add to database
        if(title && description && imgs && imgs instanceof Array) {
            var result = await ewindow_control.addNewEWindow(user.user_id, title, description, imgs);
            if(result) {
                ctx.response.body = {success:true};
            }
        } else {
            ctx.response.body = {error:'not correct format'};
        }
    } else {
        ctx.response.body = {error:'not legal user'};
    }
}

// router to upload new window
var fn_uploadRt = async(ctx, next) => {
    var s = nunjucks_control.env.render('uploaddisplay.html');
    ctx.response.body = s;
}

//init display_mine.html
var fn_initMyDisplay = async(ctx, next) => {
    var uid = ctx.params.id || -1;
    let result;
    if(uid === -1)
        result = await ewindow_control.getUserEWindows();
    else
        result = await ewindow_control.getEWindowsById(uid);

    var s = nunjucks_control.env.render('display_mine.html',{ewindows:result});
    ctx.response.body = s;
}

module.exports = {
    'POST /displays/postnew' : fn_postNew,
    'GET /displays' : fn_initListPage,
    'GET /displays/details/:id' : fn_initDetailPage,
    'GET /displays/upload' : fn_uploadRt,
    'GET /displays/my/:id' : fn_initMyDisplay,
    'GET /displays/my' : fn_initMyDisplay
}