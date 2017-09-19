/**
  article module
  when user release or look up articles, to insert or query into database
  
  
  */

var models = require('../models');
var user_control = require('/opt/gitProject/GemsIGDP/server_src/controllers/users.js');
var Sequelize = require('sequelize');


//insert an article into database
//params: user_id, title, content
//return true if insert suceess or false for not
var releaseArticlefunc = async function(user_id, title, label, content) {
        try {
            await models.article.create({
                user_id : user_id,
                title : title,
                release_time : new Date(),
                update_time : new Date(),
                label : label,
                content : content
            });
       }catch(error){
           console.log('when insert into article, errors happen: '+error);
           return false;
       }
        
       return true;
};


//delete an article from table
//params: article_id
//return true if delete success or false for not
var deleteArticlefunc = async function(article_id) {
      //1.to change the state to 0
      try{
          await models.article.update({
            state : 0},
            { where:{id : article_id} });
      }catch(error){
          console.log('delete article, errors happen: '+error);
          return false;
      }
      
      return true;
      //2.or delete this data
};

/**
 * delete an article and validate with user id
 * @param {integer} article_id the article id
 * @param {integer} userid the user id
 */
var deleteArticleByIdwithUserfunc = async function(article_id, userid) {
    var article = await models.article.findOne({
        while: {
            id : article_id
        }
    });

    if(article !== null && article.user_id === userid) {
        article.destroy({force:true});
        return true;
    }

    return false;
}


//query articles by title(for search)
//params: title
//return the article title, content, release_time and author, number of dianzan and liulan
var searchArticleByTitlefunc = async function(title) {
      //$like is not for sure!!!!!
      var t = '%'+title+'%';
      var articles = await models.article.findAll({
            where:{
                title : { $like : t},
                state : 1
            }
        });

        if(articles === null)
            console.log('search no articles...');
        //return.....
        return articles;
        
};



//to get article's id by title(no need now)
//params: title
//return article's id
var getArticleIdByTitlefunc = async function(title) {
    //find all???
    var article = await models.article.findAll({
        attributes: ['id'],
        where:{
              title : title
          }
      });
};


//find the article by id
//use for the show of full text
var searchArticleByIdfunc = async function(id) {
    var article = await models.article.findOne({
        attributes : ['user_id','title','release_time','content','dianzan','liulan'],   
        include : [{
            model : models.user,
            attributes : ['nickname'],
            where : { id : Sequelize.col('article.user_id')}//merge the user's nickname from user_info where id==article.user_id
        }],
        where:{id : id}
    });

    if(article === null)
        return null;

    var isself;
    let currentUser = user_control.getCurrentUser();
    if(currentUser === null || article.user_id === currentUser.user_id)
        isself = 'true';
    else
        isself = 'false';

    //get head picture
    var headPic = await user_control.getHeadPic(article.user_id);

    var result = {
        user_id : article.user_id,
        title : article.title,
        releasetime : article.release_time,
        content : article.content,
        dianzan : article.dianzan,
        yuedu : article.liulan,
        author : article.user.nickname,
        author_profile : headPic,
        isself : isself
    };
    
    return result;
}


//to get a user's all articles(to show in the individual page)
//params: user_id
//return all articles's title and content(and release_time,liulan,dianzan),limit for 30
var getUserArticlesfunc = async function(user_id) {
    var articles = await models.article.findAll({
        limit: 30,
        attributes:['title','content'],
        where:{
            user_id : user_id,
            state : 1
        }
    });
    
    return articles;
};



//to insert a comment of an article(with no cite comment)
//params:content, article_id
//return true for success or false for not
var addCommentfunc = async function(article_id,content) {
    //judge article_id is a number and is an integer
    if(typeof article_id === 'number' && article_id % 1 === 0)
    {
        try{
            let user_id = user_control.getCurrentUser().user_id;
            await models.commentList.create({
                content : content,
                user_id : user_id,
                article_id : article_id,
                release_time : new Date(),
                last_release_time : new Date()
            });
        }catch(error){
            console.log('add comment, errors happen: '+error);
            throw(error);
            return false;
        }
    }else{
        console.log('add comment, the article_id is not an integer!');
        throw('the article_id is not an integer!');
        return false;
    }

    return true;
};


/**
 * 
 * @param {integer} article_id 
 * @param {integer} cite_id 
 * @param {string} content 
 * @return {boolean} true for success or fail for not
 * to insert a comment in an article(have cite comment)
 */
var addCommentWithCitefunc = async function(article_id, cite_id, content){
    //judge article_id is a number and is an integer
    if(typeof article_id === 'number' && article_id % 1 === 0)
    {
        try{
            let user_id = user_control.getCurrentUser().user_id;
            await models.commentList.create({
                content : content,
                user_id : user_id,
                article_id : article_id,
                cite_comment_id : cite_id,
                release_time : new Date(),
                last_release_time : new Date()
            });
        }catch(error){
            console.log('add comment, errors happen: '+error);
            throw(error);
            return false;
        }
    }else{
        console.log('add comment, the article_id is not an integer!');
        throw({error:'the article_id is not an integer!'});
        return false;
    }

    return true;
};

//to get all comments of an article
//params: article_id
//return the author, release_time, content of all comments(limit 30)
var getCommentsfunc = async function(article_id) {
    //not sure for include!!!!
    var comments = await models.commentList.findAll({
          limit: 30,
          attributes: ['user_id','release_time','content','cite_comment_id'],
          include:[{
              model: models.user,
              attributes: ['nickname'],
              where:{ id : Sequelize.col('commentList.user_id') } //to find user's nickname(use user_id to find user)
          }],
          where:{
                article_id : article_id
          }
      });


    var i;
    var result = new Array();
    for(i in comments)
    {
        //get comment.user_profile
        var headPic = await user_control.getHeadPic(comments[i].user_id);
        //get cite comments
        var citecomment = null;
        if(comments[i].cite_comment_id != null)
        {   
            citecomment = await models.commentList.findOne({
                attributes : ['user_id','release_time','content'],
                include : [{
                    model : models.user,
                    attributes : ['nickname'],
                    where : { id : Sequelize.col('commentList.user_id')}
                }],
                where : { id : comments[i].cite_comment_id}
            });

            var cite_userprofile = await user_control.getHeadPic(citecomment.user_id);//get cite comment's user profile
        }

        if(citecomment != null)
        {
            result[i] = {
                user_id : comments[i].user_id,
                username : comments[i].user.nickname,
                user_profile : headPic,
                commenttime : comments[i].release_time,
                content : comments[i].content,
                cite_comment_id : comments[i].cite_comment_id,
                citecomment : {
                    user_profile : cite_userprofile,
                    username : citecomment.user.nickname,
                    user_id : citecomment.user_id,
                    content : citecomment.content,
                    commenttime : citecomment.release_time
                }
            };
        }
        else{
            result[i] = {
                user_id : comments[i].user_id,
                username : comments[i].user.nickname,
                user_profile : headPic,
                commenttime : comments[i].release_time,
                content : comments[i].content,
                cite_comment_id : comments[i].cite_comment_id
            };
        }
        
    }
    
    return result;
};


//get article list in this page(one page for 5 articles)
//params: page
//return articles
var getArticleListfunc = async function(page){
    console.log('currentPage: '+page);
    let p = (page - 1) * 5; 
    console.log('p : '+p);

    var articles = await models.article.findAll({
        limit : 5,
        attributes : ['id','title','release_time','label','dianzan','liulan','user_id'],
        include : [{
            model : models.user,
            attributes : ['nickname'],
            where : { id : Sequelize.col('article.user_id') } //use the user_id to find nickname in user_info table
        }],
        where :{
            id : { $gt : p} //id > p
        }
    });

    if(articles === null)
        console.log('get not articles to show in list....');
    else
        return articles;
};



//to count the number of comments of an article
//params: article_id
//return the number
var getNumberOfCommentsfunc = async function(article_id){
    var result = await models.commentList.findAndCountAll({
        where : { id : article_id }
    });

    return result.count;
};



//get the number of all articles
//return the count, use for tell html the number of pages
var getNumberOfArticlesfunc = async function(){
    var result = await models.article.findAndCountAll();

    return result.count;
};


module.exports = {
      releaseArticle : releaseArticlefunc,
      deleteArticle : deleteArticlefunc,
      deleteArticleByIdwithUser : deleteArticleByIdwithUserfunc,
      searchArticleByTitle : searchArticleByTitlefunc,
      searchArticleById : searchArticleByIdfunc,
      //getId by title
      getUserArticles : getUserArticlesfunc,
      addComment : addCommentfunc,
      addCommentWithCite : addCommentWithCitefunc,
      getComments : getCommentsfunc,
      getArticleList : getArticleListfunc,
      getNumberOfComments : getNumberOfCommentsfunc,
      getNumberOfArticles : getNumberOfArticlesfunc
};