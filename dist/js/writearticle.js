$(document).ready(function(){
    $('#informwindow').hide();
    $('#summernote').summernote({
        height: 400,
        lang:'zh-CN',
        fontNames: ['Arial', '微软雅黑', 'Times New Roman', 'consolas', '宋体', 'Microsoft Yahei'],
        toolbar: [
            ['font',['fontname','fontsize','color']],
            ['style',['bold','italic','underline','clear']],
            ['fontextra',['strikethrough','superscript','subscript']],
            ['para',['paragraph']],
            ['insert',['picture']],
            ['misc',['undo','redo']]
        ],
        callbacks:{
            onImageUpload: function(files) {
                var formdata = new FormData();
                formdata.append('file', files[0]);
                if(window.localStorage) {
                    var csrf = window.localStorage.getItem('csrf');
                    $.ajax({
                        url:'/upload/imgupload',
                        method: 'POST',
                        data:formdata,
                        processData:false,
                        contentType:false,
                        beforeSend:function(xhr) {
                            xhr.setRequestHeader('x-access-token',csrf);
                        },
                        success: function(data) {
                            if(data.error) {

                            } else {
                                $('#summernote').summernote('insertImage',data.url);
                            }
                        }
                    })
                }
            }
        }
    });
})

function onSubmitClick() {
    $('#informwindow').hide();
    var title = $('#articletitle').val();
    var titleexp = /^\D[^><\n\f\r\t\v]{3,50}/;
    if(!titleexp.test(title)) {
        $('#informwindow').html('标题不符合格式（长度不符或包含敏感字符）').show();
        return;
    }
    var text = $('#summernote').summernote('code');
    if(text.length < 30 || text.length > 30000) {
        $('#informwindow').html('正文内容太长或太短').show();
        return;
    }

    var csrf = null;
    if(window.localStorage) {
        csrf = window.localStorage.getItem('csrf');
    }

    if(csrf === null) {
        $('#informwindow').html('登录已过期，请重新登录').show();
        logOut();
        return;
    }

    // all comfirmed
    $.ajax({
        url:'/articleList/newpost',
        method:'POST',
        data:{
            title:title,
            content:text},
        cache:false,
        dataType:'json',
        beforeSend:function(xhr){
            xhr.setRequestHeader('x-access-token',csrf);
        },
        success:function(data){
            if(data.error) {
                $('#informwindow').html(data.error);
            } else {
                $('#informwindow').removeClass('alert-danger').addClass('alert-success');
                $('#informwindow').html('发布成功').show();
                window.location.href = '/articleList/1';
            }
        }
    });
}