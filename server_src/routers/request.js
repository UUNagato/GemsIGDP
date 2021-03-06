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

    console.log('request count: '+count);//!!!!test

    if(count % 6 !== 0)
        sumpage = Math.floor(count /6) + 1;
    else
        sumpage = Math.floor(count /6);

    let currentPage = parseInt(ctx.params.currentPage);
    let result = await request_control.getRequestList(currentPage);
    
    //render
    var s = await nunjucks_control.env.render('request.html', {requests:result, sumpage:sumpage, currentpage:currentPage});
    
    ctx.response.body = s; 
};


//to show the full text of a request
var fn_showFullRequest = async(ctx,next) => {
    var request = await request_control.getRequestById(ctx.params.id);

    //render
    var s = nunjucks_control.env.render('requestDetail.html', {request:request});
    ctx.response.body = s;
};


//delete a request
var fn_deleteRequest = async(ctx,next) => {
    let id = parseInt(ctx.request.body.id);
    
    try{
        await request_control.deleteRequest(id);
    }catch(error){
        console.log(error);
        ctx.response.body = {error : error};
        return;
    }
    
    ctx.response.body = 'success!';
};

//init release request page
var fn_initReleasePage = async(ctx,next) => {
    ctx.response.body = nunjucks_control.env.render('writerequest.html');
};

//release request
var fn_releaseRequest = async(ctx,next) => {
    let title = ctx.request.body.title;
    let content = ctx.request.body.content;
    let contact = ctx.request.body.contact;

    console.log('title : '+title);
    console.log('content : '+content);
    console.log('contact : '+contact);
    try{
        await request_control.releaseRequest(title,content,contact);
    }catch(error){
        ctx.response.body = {error : error};
        return;
    }

    ctx.response.body = 'success!';
};


module.exports = {
    'GET /requestList/:currentPage' : fn_initRequestPage,
    'GET /requestList/details/:id' : fn_showFullRequest,
    'GET /requestList/release/edit' : fn_initReleasePage,
    'POST /requestList/delete' : fn_deleteRequest,
    'POST /requestList/release' : fn_releaseRequest
}