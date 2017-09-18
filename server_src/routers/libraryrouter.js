'use strict'
const ctrl_library = require('../controllers/librarys.js');

var fn_librarylist = async function(ctx, next) {
    var array = await ctrl_library.getMostRecentMaterials();
    console.log(array);
};

module.exports = {
    'GET /libraries': fn_librarylist
};