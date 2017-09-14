/**
 * Upload File routers
 * This router will hold almost every file upload request
 * 
 * @author UUNagato
 */
'use strict'
const users = require('../controllers/users.js');
const fileManager = require('../controllers/filemanager.js');

/**
 * receive a form data that only contain one image.
 * @param {Context} ctx 
 * @param {MiddleWare} next 
 */
var generalImageUploadRouter = async function(ctx, next) {
    var user = users.getValidatedUser(ctx.request);
    if(user !== null) {
        var file = ctx.request.body.files.file;
        try {
            var rpath = await fileManager.singleImageUpload(user.user_id, file);
            ctx.response.body = {url:rpath};
        } catch(err) {
            ctx.response.body = {error:err.message};
        }
    } else {
        ctx.response.body = {error:'非合法用户'};
    }
};

module.exports = {
    'POST /upload/imgupload': generalImageUploadRouter
};