/*
    router: to show articles in articleList.html
            and show an article in articleUI.html
*/

'use strict'

var fs = require('fs');
var path = require('path');
var article_control = require('../controllers/articles.js');
var nunjucks_control = require('../controllers/nunjucks.js');


//init articleList page
var fn_initList = async(ctx, next) => {
    //first, get currentPage
    var currentPage = parseInt(ctx.params.currentPage);
    console.log('currentPage from html :'+currentPage);
    if(currentPage === null)
    {
        console.log('page is null');
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

    var labels = {
        label1 : {
            src : 'www.baidu.com',
            name : 'game_make'
        },
        
        label2 : {
            src : 'www.baidu.com',
            name : 'game_design'
        }
    };
    
    
    
    //render the page
    var s = nunjucks_control.env.render('articleList.html', {articles:articles, labels:labels, sumpage:page, currentpage:currentPage} );
    ctx.response.body = s;
};


//init articleUI.html
var fn_initArticlePage = async(ctx, next) => {
    let result = await article_control.searchArticleById(ctx.params.id);

    var article = {
        title : result.title,
        content : result.content,
        releasetime : result.release_time,
        author : result.user.nickname,
        dianzan : result.dianzan,
        yuedu : result.liulan
    };

    //find all comments
    let comment = await article_control.getComments(ctx.params.id);
    var comments = new Array();
    var i;
    
    for(i in comment)
    {
        comments[i] = {
            content : comment[i].content,
            username : comment[i].user.nickname,
            commenttime : comment[i].release_time
        };
    }

    
    //render
    var s = nunjucks_control.env.render('articleUI.html', {article:article, comments:comments});
    ctx.response.body = s;
};


module.exports = {
    'GET /articleList/:currentPage' : fn_initList,
    'GET /articleList/details/:id' : fn_initArticlePage
}