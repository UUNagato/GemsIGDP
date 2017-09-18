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
    // try to catch 20 items
    var libraryfiles = await models.libraryFile.findAll({
        attribute:['name','library_id','thumbnail_id','upload_time','view'],
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
                user = await library.getUser({attributes:['id','nickname']});
            }
            if(thumbnail !== null && user !== null) {
                // get user info
                result.push({
                    name: libraryfiles[i].name,
                    thumbnail_src: thumbnail.file_path,
                    uploader_nickname: user.nickname,
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
}

module.exports = {
    getMostRecentMaterials : getMostRecentMaterialsfunc
};