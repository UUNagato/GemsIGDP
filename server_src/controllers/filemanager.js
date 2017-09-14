/**
    @file This is a module that manages all files which upload to the server

    2017/9/12 Created by UUNagato
 */
'use strict'
const uploadconfig = require('../configs/uploadconfig.js');
const projectpath = require('../configs/projectpath.js');
const models = require('../models');
const fs = require('fs');
const crypto = require('crypto');

// make sure upload folder is exists
if(!fs.existsSync(projectpath.path + projectpath.relativeUploadpath)) {
    fs.mkdirSync(projectpath.path + projectpath.relativeUploadpath);
}

/**
 * Save files from multipart form
 * @param {context} ctx koa context
 * @param {integer} userid the user id
 * @return {Promise}
 */
var uploadPluginfunc = function(ctx, userid) {
    var promiseFunc = function(resolve, reject) {
        var file = ctx.request.body.files.file;
        if(file) {
            var filetype = file.type.substring(file.type.lastIndexOf('/') + 1,file.type.length);
            // check size and type
            if(uploadconfig[filetype] !== undefined) {
                if(file.size > uploadconfig[filetype].size) {
                    ctx.response.body = {error:'the file is too large.'};
                    throw new Error('the file is too large');
                }

                // upload
                var readstream = fs.createReadStream(file.path);
                var date = new Date();
                var relativepath = projectpath.relativeUploadpath + userid + date.getTime() + '.' + filetype;
                var savepath = projectpath.path + relativepath;
                var writestream = fs.createWriteStream(savepath);
                var md5 = crypto.createHash('md5');
                readstream.on('data',(src)=>{
                    md5.update(src);
                });
                readstream.on('end',async () => {
                    // get md5
                    var filemd5 = md5.digest('hex');
                    // find if file exists
                    models.file.findOne({
                        attributes: ['id','file_path'],
                        where:{
                            file_md5:filemd5
                        }
                    }).then(ret=>{
                        if(ret !== null) {
                            // if exists
                            ctx.response.body = {fid:ret.id};
                            // delete newly file
                            fs.unlink(savepath,function(err){
                                if(err) {
                                    console.log('there is a file:' + savepath + ' that failed to be deleted');
                                }
                            });
                            resolve('ok');
                        }
                        else {
                            // add data
                            models.file.create({
                                user_id:userid,
                                file_name:file.name,
                                file_path:savepath,
                                upload_time: new Date(),
                                file_md5:filemd5,
                                file_type:filetype
                            }).then(nfile => {
                                ctx.response.body = {fid:nfile.id};
                                resolve('ok');
                            });
                        }
                    })
                });

                readstream.pipe(writestream);
            }
            else {
                ctx.response.body = {error:'not supported type'};
                throw new Error('not supported type');
            }
        } else {
            ctx.response.body = {error:'no file data'};
            throw new Error('no file data');
        }
    }

    return(new Promise(promiseFunc));
}

module.exports = {
    uploadPlugin : uploadPluginfunc
};