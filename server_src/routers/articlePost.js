/**
 * This is a router that receive article post request
 * @author UUNagato
 */
'user strict'
const users = require('../controllers/users.js');
const articles = require('../controllers/articles.js');

var fn_articlepost = async function(ctx, next) {
    var user = users.getValidatedUser(ctx.request);
    if(user !== null) {
        console.log(ctx.request.body.title);
        console.log(ctx.request.body.content);
        // get text
        var title = ctx.request.body.title;
        var content = ctx.request.body.content;
        var titleexp = /^\D[^><\n\f\r\t\v]{6,50}/;
        if(titleexp.test(title)) {
            if(content.length >= 30 && content.length <= 30000 ) {
                var result = await articles.releaseArticle(user.user_id, title, content);
                if(result) {
                    ctx.response.body = {success:'success'};
                } else {
                    ctx.response.body = {error:'由于不明错误而发布失败。'};
                }
            } else {
                ctx.response.body = {error:'正文内容太长或太短'};
            }
        } else {
            ctx.response.body = {error:'标题不符合格式（长度不符或包含敏感字符）'};
        }
    } else {
        ctx.response.body = {error:'非合法用户'};
    }
};

module.exports = {
    'POST /articleList/newpost': fn_articlepost
};