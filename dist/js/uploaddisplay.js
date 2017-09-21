$().ready(function(){
    $('#infodiv').hide();
    $('#imginput').fileinput({
        language: 'zh',
        uploadUrl:'/upload/imguploadid',
        layoutTemplates: {
            actionUpload:''
        },
        uploadAsync: false,
        showUpload: false,
        allowedFileExtensions: ['jpg','jpeg','png','gif'],
        previewFileType:'image',
        maxFileSize:5242000,
        maxFileCount:5,
        minFileCount:1
    });
    $('#imginput').on('filebatchuploadsuccess', function(event, data) {
        var res = data.response;
        if(!res.error) {
            uploadImgIds = res.id;
            // send post
            postFullWindow();
        }
    });
});

function postFullWindow() {
    if(uploadImgIds && uploadImgIds.length >= 1) {
        $.post(
            '/displays/postnew',
            {
                imgs: uploadImgIds,
                title: $('#title').val(),
                description: $('#description').val()
            },
            function(data) {
                if(data.error) {
                    showInfo('不明上传错误');
                } else {
                    window.location.href = '/displays';
                }
            }
        );
    }
}

var uploadImgIds;
function postWindow() {
    $('#infodiv').hide();
    $('.form-group').removeClass('has-error');

    var title = $('#title').val();
    var description = $('#description').val();

    var titleexp = /^\D[^><\n\f\r\t\v]{2,50}/;
    if(titleexp.test(title)) {
        // upload picture
        $('#submitbtn').attr('disabled','disabled');
        $('#description').attr('disabled','disabled');
        $('#title').attr('disabled','disabled')
        $('#imginput').fileinput('upload');
    } else {
        showInfo('不合法的标题');
        $('#titlegroup').addClass('has-error');
    }
}

function showInfo(info) {
    $('#infodiv').text(info).show();
}