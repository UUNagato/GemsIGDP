/*
 This is the entrant js file.
 Just check its status and set router

 2017/9/4 Basic Application flow, using koa,koa-router,koa-bodyparser
 Modified by UUNagato
 */
'use strict'

const Koa = require('koa');
const router = require('koa-router')();
const bodyparser = require('koa-bodyparser');
const models = require('./models');
const users = require('./controllers/users.js');
const app = new Koa();

const fs = require('fs');

// first log out there's a request
app.use(async(ctx, next) => {
    console.log('new request method:' + ctx.request.method + ',url:' + ctx.request.url);
    await next();
});

// deal with post body
app.use(bodyparser());

// here do router
// Search all router dealers
var files = fs.readdirSync(__dirname + '/routers');
var js_files = files.filter((f)=>{
    return f.endsWith('.js');
});

for(var f of js_files) {
    console.log('router - ' + f + ' has been found.');
    // import js files
    let mapping = require(__dirname + '/routers/' + f);
    for(var url in mapping) {
        if(url.startsWith('GET ')) {
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log('router - GET added - ' + path);
            console.log(mapping[url]);
        } else if(url.startsWith('POST ')) {
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log('router - POST added - ' + path);
        } else {
            console.log('Invalid url ' + url);
        }
    }
}

// user token check
app.use(users.middleware);

app.use(router.routes());


app.listen(8100);
console.log('Server is running on port - 8100');