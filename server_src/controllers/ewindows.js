/*
    to insert and query in the exhibition_window, file and exhibition_files table
    and use for show exhibition windows in page, or release windows
*/

var models = require('../models');
var Sequelize = require('sequelize');


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
            attributes : ['nickname'],
            where : { id : Sequelize.col('exhibitionWindow.user_id')}
        }],
        where : {id : id}
    });

    //test!!!!
    console.log('test title:'+ewindow.title);
    
    var files = await ewindow.getFiles(); //may be an array
    var i;
    var paths = new Array();
    for(i in files)
    {
        paths[i] = files[i].path;
    }

    var result = {
        ewindow : {
            title : ewindow.title,
            introduce : ewindow.introduce,
            author : ewindow.user.nickname,
            createDate : ewindow.create_date,
            dianzan : ewindow.dianzan,
            liulan : ewindow.liulan
        },
        files : files
    };

    return result;
}


module.exports = {
    getExhibitionList : getExhibitionListfunc,
    getAEWindow : getAEWindowfunc
};