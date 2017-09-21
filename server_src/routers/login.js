/*
    Login Router
    Created by UUNagato 2017/9/11
 */
'use strict'
var user = require('../controllers/users.js');
const projectpath = require('../configs/projectpath.js');
var fs = require('fs');

var userchecker = /^[a-zA-Z0-9_]{6,18}$/;
var emailchecker = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
var passchecker = /[^><\s]{6,18}/;

var rt_loginpage = async function(ctx, next) {
    // check if is logged in
    if(user.getCurrentUser() !== null) {
        // redirect to index
        ctx.response.redirect('/');
    } else {
        ctx.response.type = 'html';
        ctx.response.body = fs.createReadStream(projectpath.path + '/login.html');
    }
};

var rt_loginchecker = async function(ctx, next) {
    var queryBody = {};
    // should get a post request
    if(ctx.request.body.username) {
        // use username to login
        // check username
        if(!userchecker.test(ctx.request.body.username)) {
            // error
            ctx.body = {error:0};
            return;
        }
        queryBody['user_name'] = ctx.request.body.username;

    } else if (ctx.request.body.email) {
        if(!emailchecker.test(ctx.request.body.email)) {
            ctx.body = {error:0};
            return;
        }
        queryBody['email'] = ctx.request.body.username;
    }

    // check password
    if(!passchecker.test(ctx.request.body.password)) {
        ctx.body = {error:1};
        return;
    }

    var token = await user.tryLogin(queryBody, ctx.request.body.password);
    if(token !== null && token.token !== null && token.csrf !== null) {
        ctx.body = token;
    } else {
        ctx.body = {error:2};
    }
};

module.exports = {
    'GET /login': rt_loginpage,
    'POST /login/check': rt_loginchecker
}