/*
  article module
  when user release or look up articles, to insert or query into database
  
  
  */

  var models = require('../models');


  //insert an article into database
  //params: user_id, title, content
  //return true if insert suceess or false for not
  var releaseArticlefunc = async function(user_id, title, content) {
       try {
            await models.article.create({
                user_id : user_id,
                title : title,
                release_time : Date.now(),
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


  //query articles by title(for search)
  //params: title
  //return the article title, content, release_time and author, number of dianzan and liulan
  var searchArticleByTitlefunc = async function(title) {
      var articles = await models.article.findAll({
            where:{
                title : title
            }
        });

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


  //to get a user's all articles(to show in the individual page)
  //params: user_id
  //return all articles's title and content(and release_time,liulan,dianzan),limit for 30
  var getUserArticlesfunc = async function(user_id) {
        var articles = await models.article.findAll({
            limit: 30,
            where:{
                user_id : user_id
            }
        });

        //return ....
        return articles;
  };



  //to insert a comment of an article
  //params:content, user_id, article_id
  //return true for success or false for not
  var addCommentfunc = async function(content,user_id,article_id) {
      try{
          await models.commentList.create({
              content : content,
              user_id : user_id,
              article_id : article_id,
              release_time : Date.now()
          });
      }catch(error){
          console.log('add comment, errors happen: '+error);
          return false;
      }

      return true;
  };



  //to get all comments of an article
  //params: article_id
  //return the author, release_time, content of all comments(limit 30)
  var getCommentsfunc = async function(article_id) {
      var comments = await models.commentList.findAll({
          limit: 30,
          attributes: ['user_id','release_time','content'],
          where:{
                article_id : article_id
          }
      });

      var username = await models.user.findAll({
          attributes: ['nickname'],
          where:{
                id : comments.user_id
          }
      });
        
      //return ...(may query username by user_id)
  }

  module.exports = {
      releaseArticle : releaseArticlefunc,
      deleteArticle : deleteArticlefunc,
      searchArticleByTitle : searchArticleByTitlefunc,
      //getId by title
      getUserArticles : getUserArticlesfunc,
      addComment : addCommentfunc,
      getComments : getCommentsfunc
  }