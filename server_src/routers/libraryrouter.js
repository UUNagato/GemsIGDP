'use strict'
const ctrl_library = require('../controllers/librarys.js');
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
    console.log(ctx.request.body.files);
};



module.exports = {
    'GET /materials': fn_librarylist,
    'GET /materials/details/:id': fn_initDetails,
    'POST /materials/upload': fn_uploadFiles
};