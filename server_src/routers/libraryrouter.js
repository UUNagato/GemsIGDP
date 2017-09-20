'use strict'
const ctrl_library = require('../controllers/librarys.js');
const ctrl_user = require('../controllers/users.js');
const fileManager = require('../controllers/filemanager.js')
var nunjucks_control = require('../controllers/nunjucks.js');

//init sucai.html
var fn_librarylist = async function(ctx, next) {
    var result = await ctrl_library.getMostRecentMaterials();
    
    //render
    var s = nunjucks_control.env.render('sucai.html',{items : result});
    ctx.response.body = s;
};


//init sucai_detail.html
var fn_initDetails = async(ctx, next) => {
    let id = parseInt(ctx.params.id);
    var library = await ctrl_library.getALibraryfileById(id);

    let t = library.tags;//get the library's tags
    //split tags
    var tags = new Array();
    tags = t.split(',');

    //get library files with same tags
    var files = await ctrl_library.getLibrarysByTags(t);

    //render
    var s = nunjucks_control.env.render('sucai_detail.html',{model:library, tags:tags, items:files});
    ctx.response.body = s;
};

var fn_uploadFiles = async(ctx, next) => {
    var user = ctrl_user.getValidatedUser(ctx.request);
    if(user !== null && ctx.request.body.files.file !== undefined) {
        if(ctx.request.body.files.thumbnail !== undefined) {
            // there is thumbnail picture
            var thumbnailid = await fileManager.imageUploadGetId(user.user_id, ctx.request.body.files.thumbnail);
            console.log(thumbnailid);
        }

        var fileid = await fileManager.singleFileUpload(user.user_id, ctx.request.body.files.file);
        
        ctx.response.body = {thumbnail:thumbnailid,file:fileid};
    } else {
        ctx.response.body = {error:'illegal user'};
    }
};

var fn_uploadMaterial = async(ctx, next) => {
    var user = ctrl_user.getValidatedUser(ctx.request);
    console.log(user);
    if(user !== null) {
        var name = ctx.request.body.name;
        var tags = ctx.request.body.tags;
        var thumbnail = ctx.request.body.thumbnailid;
        var file = ctx.request.body.fileid;

        var ret = await ctrl_library.uploadAMaterial(name, tags, user.user_id, file, thumbnail);
        if(ret) {
            ctx.response.body = {success:true};
        } else {
            ctx.response.body = {error:'发生未知错误'};
        }
    } else {
        ctx.response.body = {error:'illegal user'};
    }
}


module.exports = {
    'GET /materials': fn_librarylist,
    'GET /materials/details/:id': fn_initDetails,
    'POST /materials/upload': fn_uploadFiles,
    'POST /materials/materialupload': fn_uploadMaterial
};