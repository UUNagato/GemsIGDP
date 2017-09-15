/*
    router : to use the ewindow controller to show windows in page
    or release a exhibition window
*/

var fs = require('fs');
var path = require('path');
var ewindow_control = require('../controllers/ewindows.js');
var nunjucks_control = require('../controllers/nunjucks.js');


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

module.exports = {
    'GET /ewindow' : fn_initListPage,
    'GET /ewindow/details/:id' : fn_initDetailPage
}