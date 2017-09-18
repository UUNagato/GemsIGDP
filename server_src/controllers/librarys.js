/**
 * This controller controls the library of every user
 */
'use strict'
const models = require('../models');

/**
 * @return {Promise} an array of most recent files
 * they have properties:
 * name:file_name
 * thumbnail_src:thumbnail_picture_src
 * uploader_nickname:the nickname of uploader
 * view:the view times
 * upload_time:the upload times
 */
var getMostRecentMaterialsfunc = async function() {
    var result = new Array();
    var headPic;
    // try to catch 20 items
    var libraryfiles = await models.libraryFile.findAll({
        attributes:['name','library_id','thumbnail_id','upload_time','view'],
        limit: 20,
        order: [['upload_time','DESC']]
    });

    if(libraryfiles !== null) {
        for(let i in libraryfiles) {
            // get library_info and file_info
            var thumbnail = await libraryfiles[i].getThumbnail();
            var library = await libraryfiles[i].getLibrary({attributes:['id','user_id']});
            var user = null;
            if(library !== null) {
                user = await library.getUser({attributes:['id','nickname','profile']});
            }
            //get author's profile
            if(user.profile === 0 || user.profile === null)
                headPic = '/img/defaultprofile.png';
            else
            {
                let file = await models.file.findOne({
                    attributes : ['file_path'],
                    where : {id : profile}
                });
                headPic = file.file_path;
            }
               
            if(thumbnail !== null && user !== null) {
                // get user info
                result.push({
                    id : libraryfiles[i].id,
                    title: libraryfiles[i].name,
                    thumbnail_src: thumbnail.file_path,
                    uploader_nickname: user.nickname,
                    uploader_profile : headPic,
                    view: libraryfiles[i].view,
                    upload_time: libraryfiles[i].upload_time
                });
            }
            else {
                return [];
            }
        }
        return result;
    } else {
        return [];
    }
};

/**
 * 
 * @param {Integer} id 
 * @return {Promise} the result of a libraryfile
 * user for init library details page
 */
var getALibraryfileByIdfunc = async function(id){
    var libraryFile = await models.libraryFile.findOne({
        attributes : ['name','library_id','tags','upload_time','view','file_id'],
        where : {id : id}
    });

    //get library file's src
    let f = await models.file.findOne({
        attributes : ['file_path'],
        where : {id : libraryFile.file_id}
    });
    let src = f.file_path;

    //get uploader
    var library = await libraryFile.getLibrary({attributes:['id','user_id']});
    var user = null;
    if(library !== null) {
        user = await library.getUser({attributes:['id','nickname','profile']});

        //get uploader's profile
        var headPic;
        if(user.profile === 0 || user.profile === null)
            headPic = '/img/defaultprofile.png';//default profile
        else{
            let file = await models.file.findOne({
                attributes : ['file_path'],
                where : {id : user.profile}
            });
            headPic = file.file_path;
        }
    }
    
    //construct result
    var result = {
        name : libraryFile.name,
        tags : tags,
        src : src,
        upload_time : libraryFile.upload_time,
        author_name : user.nickname,
        author_profile : headPic,
        view : libraryFile.view
    };

    return result;
};


/**
 * 
 * @param {String} tags 
 * @return {Promise} an array of result(include name,author_name,src,view)
 * user for show library files with the same tags
 */
var getLibrarysByTagsfunc = async function(tags){
    var tag = '%'+tags+'%';
    var libraryFiles = models.libraryFile.findAll({
        attributes : ['name','library_id','file_id','view'],
        where : {tags : {$like : tag}} //query by tags(the user of $like is not sure)
    });

    var i;
    var result = new Array();
    for(i in libraryFiles)
    {
        //get uploader
        var library = await libraryFiles[i].getLibrary({attributes:['id','user_id']});
        var user = null;
        if(library !== null) {
            user = await library.getUser({attributes:['nickname']});
        }

        //get file src
        var file = await models.file.findOne({
            attributes : ['file_path'],
            where : {id : libraryFiles[i].file_id}
        });

        result[i] = {
            name : libraryFiles[i].name,
            author_name : user.nickname,
            src : file.file_path,
            view : libraryFiles[i].view
        };
    }

    return result;
};


module.exports = {
    getMostRecentMaterials : getMostRecentMaterialsfunc,
    getALibraryfileById : getALibraryfileByIdfunc,
    getLibrarysByTags : getLibrarysByTagsfunc
};