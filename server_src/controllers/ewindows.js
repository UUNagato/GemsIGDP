/*
    to insert and query in the exhibition_window, file and exhibition_files table
    and use for show exhibition windows in page, or release windows
*/

var models = require('../models');
var Sequelize = require('sequelize');
var user_control = require('/opt/gitProject/GemsIGDP/server_src/controllers/users.js');


//get all exhibition windows
//use for show list in display.html
//return result include the info of exhibition windows and its files
var getExhibitionListfunc = async function(){
    var i;
    var results = new Array();

    var windows = await models.exhibitionWindow.findAll({
        limit : 30,
        attributes : ['id','title','introduce'],
        include:[{
            model : models.user,
            attributes : ['nickname'],
            where : {id : Sequelize.col('exhibitionWindow.user_id')} //get author's name
        }/*{
            model : models.files,
            attributes : ['file_path'] //get all files' path
        }*/]
    });
        
    
    //get exhibition windows' files, construct results
    for(i in windows)
    {
        var efiles = await windows[i].getFiles();//get files, efiles may be an array
        
        results[i] = {
            ewindow : {
                id : windows[i].id,
                title : windows[i].title,
                introduce : windows[i].introduce,
                author : windows[i].user.nickname
            },
            file : {
                path : efiles[0].file_path
            }
        };
        console.log('path: '+efiles[0].file_path);
    }

    return results;
};


//get a exhibition window's info and its files
//use for show in display_detail.html
//params: window_id
//return result include info and files
var getAEWindowfunc = async function(id) {
    var ewindow = await models.exhibitionWindow.findOne({
        attributes : ['id','title','introduce','create_date','dianzan','liulan'],
        include : [{
            model : models.user,
            attributes : ['nickname','profile'],
            where : { id : Sequelize.col('exhibitionWindow.user_id')}
        }],
        where : {id : id}
    });

    //get author's head picture
    var headPic;
    if(ewindow.user.profile === 0 || ewindow.user.profile === null)
    {
        //default head picture
        headPic = '/img/defaultprofile.png';
    }
    else{
        let headFile = await models.file.findOne({
            attributes : ['file_path'],
            where : {id : ewindow.user.profile}
        });
        headPic = headFile.file_path;
    }

    //get files
    var items = await ewindow.getFiles(); //may be an array
    var i;
    var files = new Array();
    for(i in items)
    {
        files[i] = {
            path : items[i].file_path,
            num : i
        };
    }

    var result = {
        ewindow : {
            title : ewindow.title,
            introduce : ewindow.introduce,
            author : ewindow.user.nickname,
            headPic : headPic,
            createDate : ewindow.create_date,
            dianzan : ewindow.dianzan,
            liulan : ewindow.liulan
        },
        files : files //an array
    };

    return result;
}

/**
 * add a new ewindow to database
 * @param {integer} userid
 * @param {string} title 
 * @param {string} des 
 * @param {Array(integer)} imgs 
 */
var addNewEWindowfunc = async function(userid, title, des, imgs) {
    var nitem = await models.exhibitionWindow.create({
        user_id : userid,
        title : title,
        introduce : des,
        create_date : new Date()
    });

    if(nitem !== null) {
        var i = 0;
        for(i in imgs) {
            var nfitem = await models.exhibitionFiles.create({
                window_id : nitem.id,
                file_id : imgs[i]
            });
            if(nfitem === null)
                console.log('Warning! exhibition window ' + nitem.id + ' file insert failed');
        }
    }
}

/**
 * get current user's all exhibition windows
 * user for show in the display_mine.html
 */
var getUserEWindowsfunc = async function(){
    let user = user_control.getCurrentUser();
    let windows = await models.exhibitionWindow.findAll({
        attributes : ['id','title','introduce'],
        include : [{
            model : models.user,
            attributes : ['nickname'],
            where : {id : Sequelize.col('exhibitionWindow.user_id')}
        }],
        where : {user_id : user.user_id}
    });

    var i;
    var result = new Array();
    for(i in windows)
    {
        //get file path
        var files = await windows[i].getFiles({attributes:['file_path']});
        
        result[i] = {
            title : windows[i].title,
            introduce : windows[i].introduce,
            author : windows[i].user.nickname,
            filepath : files[0].file_path
        }
    }

    return result;
};

module.exports = {
    getExhibitionList : getExhibitionListfunc,
    getAEWindow : getAEWindowfunc,
    addNewEWindow : addNewEWindowfunc,
    getUserEWindows : getUserEWindowsfunc
};