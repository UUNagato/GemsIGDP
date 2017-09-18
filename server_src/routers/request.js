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
    let count = await request_control.countRequests();
    var sumpage;

    if(count % 6 !== 0)
        sumpage = Math.floor(count /6) + 1;
    else
        sumpage = Math.floor(count /6);

    let currentPage = parseInt(ctx.params.currentPage);
    let result = await request_control.getRequestList(currentPage);
    
    //render
    var s = await nunjucks_control.env.render('requestList.html', {requests:requests, sumpage:sumpage, currentPage:currentPage});
    
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
    'GET /requestList/:currentPage' : fn_initRequestPage,
    'GET /requestList/details/:id' : fn_showFullRequest
}