$().ready(function(){
    var login = isLocallyLogin();
    var self = $('#title').attr("self");
    if(login && (self == "true")){
        document.getElementById("hiddenbtn").style.display="";
    }

    $('#summernote').summernote({
        height: 200,
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
});

function Delete(){
    if(confirm("确定删除？")){
        var url = window.location.href;
        var address = new Array();
        address = url.split("/");
        var add = parseInt(address[address.length-1]);

        var csrf = window.localStorage.getItem('csrf');
        $.ajax({
            url:'/articleList/delete',
            type:'POST',
            cache:false,
            data:{article_id:add},
            beforeSend:function(req){
                req.setRequestHeader('x-access-token',csrf)
            },
            success:function(data){
                if(data.error)
                    alert("删除失败");
                else{
                    window.location.href="/articleList/1";
                }
                
            }
        })
    }
}

function Edit() {
    // record data
    var id = window.location.href;
    id = id.substring(id.lastIndexOf('/') + 1,id.length);
    id = parseInt(id);
    
    var title = $('#title').text();
    var content = $('#content').text();

    window.localStorage.setItem('editid', id);
    window.localStorage.setItem('edittitle', title);
    window.localStorage.setItem('editcontent', content);

    window.location.href = '/articleList/articleedit/edit';
}

function onCommentClick(){
    var login = isLocallyLogin();
    if(login){
        var csrf = null;
        if(window.localStorage) {
            csrf = window.localStorage.getItem('csrf');
        }

        var text = $('#summernote').summernote('code');
        var url = window.location.href;
        var address = new Array();
        address = url.split("/");
        var add = parseInt(address[address.length-1]);

        if(document.getElementById("commentbtn").innerHTML == "评论"){
            $.ajax({
                url:'/articleList/comment/add',
                method:'POST',
                data:{
                    articleid:add,
                    content:text},
                //cache:false,
                beforeSend:function(xhr){
                    xhr.setRequestHeader('x-access-token',csrf);
                },
                success:function(data){
                    if(data.error) {
                        alert(data.error);
                    } else {
                        alert("评论成功");
                        window.location.reload();
                    }
                }
            });
        }
        else{
            console.log('cite id:'+id_temp);//for test!!!!!!!!!
            $.ajax({
                url:'/articleList/comment/addWithCite',
                method:'POST',
                data:{
                    articleid:add,
                    citecommentid:id_temp,
                    content:text},
                //cache:false,
                beforeSend:function(xhr){
                    xhr.setRequestHeader('x-access-token',csrf);
                },
                success:function(data){
                    if(data.error) {
                        alert(data.error);
                    } else {
                        alert("评论成功");
                        window.location.reload();
                    }
                }
            });
        }

    }
    else{
        alert("请先登录");
    }
    
}

var id_temp;

function onReplyClick(obj){
    ScrollToControl("note");
    document.getElementById("cancelbtn").style.display = "";
    document.getElementById("commentbtn").innerHTML ="回复";
    document.getElementById("commentbtn").classList.remove("commentbtn");
    document.getElementById("commentbtn").classList.add("btn-primary");
    document.getElementById("commentbtn").classList.remove("btn-lg");
    document.getElementById("commentbtn").classList.add("btn-default");
    var $event = $(obj);
    id_temp = $event.attr('id');
}

function onCancelClick(){
    document.getElementById("cancelbtn").style.display = "none";
    document.getElementById("commentbtn").innerHTML ="评论";
    document.getElementById("commentbtn").classList.remove("btn-primary");
    document.getElementById("commentbtn").classList.add("commentbtn");
    document.getElementById("commentbtn").classList.remove("btn-default");
    document.getElementById("commentbtn").classList.add("btn-lg");
}

function elementPosition(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
     curleft = obj.offsetLeft;
     curtop = obj.offsetTop;
     while (obj = obj.offsetParent) {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
     }
    }
    return { x: curleft, y: curtop };
  }
  function ScrollToControl(id)
  {
   var elem = document.getElementById(id);
   var scrollPos = elementPosition(elem).y;
   scrollPos = scrollPos - document.documentElement.scrollTop;
   var remainder = scrollPos % 50;
   var repeatTimes = (scrollPos - remainder) / 50;
   ScrollSmoothly(scrollPos,repeatTimes);
   window.scrollBy(0,remainder);
  }
  var repeatCount = 0;
  var cTimeout;
  var timeoutIntervals = new Array();
  var timeoutIntervalSpeed;
  function ScrollSmoothly(scrollPos,repeatTimes)
  {
   if(repeatCount < repeatTimes)
   {
   window.scrollBy(0,50);
   }
   else
   {
   repeatCount = 0;
   clearTimeout(cTimeout);
   return;
   }
  repeatCount++;
  cTimeout = setTimeout("ScrollSmoothly('"+scrollPos+"','"+repeatTimes+"')",10);
  }

  function onGuanzhuClick(){
      if(document.getElementById("guanzhu").innerHTML == "关注"){
        document.getElementById("guanzhu").innerHTML="已关注";
      }
      else{
        document.getElementById("guanzhu").innerHTML="关注";
      }
  }