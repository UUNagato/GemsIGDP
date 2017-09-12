var nunjucks_control = require('../controllers/nunjucks.js');
var fs = require('fs');
var path = require('path');




var fn_initRequestPage = async(ctx,next) => {

    var user = {
        name : 'hahaha',
        homepage : 'www.baidu.com',
        imgsrc : '../../dist/img'
    };
    var request = {
        title : 'request1',
        releasetime : 2017-9-11,
        yuedu : 1,
        content : 'need games!!!',
        connection : '110'
    };

    var s = nunjucks_control.env.render('requestUI.html', { user : user , request : request});
    //nunjucks_control.env.render('requestUI.html', { request : request });
    
    ctx.response.type = 'html';
    ctx.response.body = s; 

};


module.exports = {
    'GET /request' : fn_initRequestPage
}