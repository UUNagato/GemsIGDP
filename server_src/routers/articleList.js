/*
    router: to show articles in articleList.html
            and show an article in articleUI.html
*/

'use strict'

var fs = require('fs');
var path = require('path');
var article_control = require('../controllers/articles.js');
var nunjucks_control = require('../controllers/nunjucks.js');
const users = require('../controllers/users.js');


//init articleList page
var fn_initList = async(ctx, next) => {
    //first, get currentPage
    var currentPage = parseInt(ctx.params.currentPage);
    
    if(currentPage === null)
    {
        currentPage = 1;
    }
        
    
    var result = await article_control.getArticleList(currentPage);//second, search the current page's article list
    var count = await article_control.getNumberOfArticles();//get the number of articles
    var i, page;
    var articles = new Array();

    //count the pages
    if(count % 5 !== 0)
        page = Math.floor(count /5) + 1;
    else
        page = Math.floor(count /5);

    console.log('pages:'+page);

    for(i in result)
    {
        var count = await article_control.getNumberOfComments(result[i].id);
        
        articles[i] = {
            id : result[i].id,
            title : result[i].title,
            author : result[i].user.nickname,
            label : result[i].label,
            releasetime : result[i].release_time,
            dianzan : result[i].dianzan,
            liulan : result[i].liulan,
            commentcount : count
        };
    }

    
    //render the page
    var s = nunjucks_control.env.render('articleList.html', {articles:articles, sumpage:page, currentpage:currentPage} );
    ctx.response.body = s;
};


//init articleUI.html
var fn_initArticlePage = async(ctx, next) => {
    let result = await article_control.searchArticleById(ctx.params.id);

    //find all comments
    let comments = await article_control.getComments(ctx.params.id);
    
    //render
    var s = nunjucks_control.env.render('articleUI.html', {article:result, comments:comments});
    ctx.response.body = s;
};

// router deal with article delete
var fn_deleteArticle = async(ctx, next) => {
    var user = users.getValidatedUser(ctx.request);
    var articleid = ctx.request.body.article_id;
    if(user !== null) {
        var result = await article_control.deleteArticleByIdwithUser(articleid, user.user_id);
        if(result === true) {
            ctx.response.body = {success:true};
        } else {
            ctx.response.body = {error:'unknown error'};
        }
    } else {
        ctx.response.body = {error:'Illegal User.'};
    }
}

// deal with post article.
const titleexp = /^\D[^><\n\f\r\t\v]{6,50}/;
var fn_articlepost = async function(ctx, next) {
    var user = users.getValidatedUser(ctx.request);
    if(user !== null) {
        // get text
        var title = ctx.request.body.title;
        var content = ctx.request.body.content;
        if(titleexp.test(title)) {
            if(content.length >= 10 && content.length <= 30000 ) {
                var result = await article_control.releaseArticle(user.user_id,title,'game_design',content);
                if(result) {
                    ctx.response.body = {success:'success'};
                } else {
                    ctx.response.body = {error:'由于不明错误而发布失败。'};
                }
            } else {
                ctx.response.body = {error:'正文内容太长或太短'};
            }
        } else {
            ctx.response.body = {error:'标题或联系方式不符合格式（长度不符或包含敏感字符）'};
        }
    } else {
        ctx.response.body = {error:'非合法用户'};
    }
};

// return write new page
var fn_writeNew = async function(ctx, next) {
    ctx.response.body = nunjucks_control.env.render('writearticle.html');
};


module.exports = {
    'GET /articleList/:currentPage' : fn_initList,
    'GET /articleList/details/:id' : fn_initArticlePage,
    'GET /articleList/writenew/new' : fn_writeNew,
    'POST /articleList/delete' : fn_deleteArticle,
    'POST /articleList/newpost' : fn_articlepost
}