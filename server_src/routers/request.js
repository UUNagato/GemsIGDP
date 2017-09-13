var nunjucks_control = require('../controllers/nunjucks.js');
var user_control = require('../controllers/users.js');
var request_control = require('../controllers/requests.js');
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
        releasetime : new Date(),
        yuedu : 1,
        content : 'need games!!!',
        connection : '110'
    };

    var s = nunjucks_control.env.render('requestUI.html', { user : user , request : request});
    
    ctx.response.type = 'html';
    ctx.response.body = s; 

};


//to show the full text of a request
var fn_showFullRequest = async(ctx,next) => {
    var result = await request_control.getRequestById(ctx.params.id);

    var request = {
        title : result.title,
        content : result.content,
        connection : result.connection,
        yuedu : result.yuedu,
        releasetime : result.release_time
    }

    let user_id = result.user_id;

    var s = nunjucks_control.env.render('requestUI.html', {});

    ctx.response.body = s;
};


module.exports = {
    'GET /request' : fn_initRequestPage,
    'GET /request/details/:id' : fn_showFullRequest
}