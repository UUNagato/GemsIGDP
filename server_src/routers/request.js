/*
    router : show requests in requestList.html
             and show a request details in requestUI.html
*/


var nunjucks_control = require('../controllers/nunjucks.js');
var user_control = require('../controllers/users.js');
var request_control = require('../controllers/requests.js');
var fs = require('fs');
var path = require('path');




var fn_initRequestPage = async(ctx,next) => {

    let result = await request_control.getRequestList();
    var requests = new Array();
    var i;

    console.log('request count: '+String(result.count));
    
    for(i in result.rows)
    {
        requests[i] = {
            id : result.rows[i].id,
            title : result.rows[i].title,
            author : result.rows[i].user.nickname,
            releasetime : result.rows[i].release_time
        };
    }

    
    //render
    var s = await nunjucks_control.env.render('requestList.html', {requests : requests});
    
    ctx.response.body = s; 
};


//to show the full text of a request
var fn_showFullRequest = async(ctx,next) => {
    var result = await request_control.getRequestById(ctx.params.id);

    var request = {
        title : result.title,
        author : result.user.nickname,
        content : result.content,
        contact : result.contact,
        yuedu : result.yuedu,
        releasetime : result.release_time
    }

    var s = nunjucks_control.env.render('requestUI.html', {request:request});

    ctx.response.body = s;
};


module.exports = {
    'GET /request' : fn_initRequestPage,
    'GET /request/details/:id' : fn_showFullRequest
}