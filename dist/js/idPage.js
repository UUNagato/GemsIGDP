function changeDiv_1()
{
    $('.right-2').attr("style","display:none;");
    $('.right-3').attr("style","display:none;");
    $('.right-4').attr("style","display:none;");
    $('.right-1').attr("style","display:block;");//显示div
}

function changeDiv_2()
{
    $('.right-1').attr("style","display:none;");
    $('.right-3').attr("style","display:none;");
    $('.right-4').attr("style","display:none;");
    $('.right-2').attr("style","display:block;");//显示div
}

function changeDiv_3()
{
    $('.right-2').attr("style","display:none;");
    $('.right-1').attr("style","display:none;");
    $('.right-4').attr("style","display:none;");
    $('.right-3').attr("style","display:block;");//显示div
}

function changeDiv_4()
{
    $('.right-2').attr("style","display:none;");
    $('.right-3').attr("style","display:none;");
    $('.right-1').attr("style","display:none;");
    $('.right-4').attr("style","display:block;");//显示div
}

function showWindow(w,h)
{
    var popUp = document.getElementById("changeHead"); 
    popUp.style.top = "250px"; 
    popUp.style.left = "180px"; 
    popUp.style.width = w + "px"; 
    popUp.style.height = h + "px"; 
    //if (baseText == null) baseText = popUp.innerHTML; 
    //popUp.innerHTML = baseText + "<div id=\"statusbar\"><button onclick=\"hidePopup();\">Close window</button></div>"; 
    //var sbar = document.getElementById("statusbar"); 
    //sbar.style.marginTop = (parseInt(h)-40) + "px"; 
    popUp.style.visibility = "visible"; 
}

function showInfoChange(h)
{
    var popUp = document.getElementById("changeInfo"); 
    popUp.style.width = "100%"; 
    popUp.style.height = h + "px"; 
    //if (baseText == null) baseText = popUp.innerHTML; 
    //popUp.innerHTML = baseText + "<div id=\"statusbar\"><button onclick=\"hidePopup();\">Close window</button></div>"; 
    //var sbar = document.getElementById("statusbar"); 
    //sbar.style.marginTop = (parseInt(h)-40) + "px"; 
    popUp.style.visibility = "visible";
}
function headClose()
{
    var popUp = document.getElementById("changeHead");
    popUp.style.visibility = "hidden";
}
function infoClose()
{
    var popUp = document.getElementById("changeInfo");
    popUp.style.visibility = "hidden";
}
function headPreview()
{
    var img = document.getElementById("headImag").value;
    var head = document.getElementById("headPre");
    console.log('the file url:'+img);
    head.style.backgroundImage = "url("+img+')';
    
}
function like(event)
{
    if(event.colortype === 0)
        event.colortype = 1;
    else
        event.colortype = 0;

    if(event.colortype === 0)
        $(event).attr("style","color:#FF2020;");
    else
        $(event).css('color','#2A2A2A');
}

$(function(){
    $('.glyphicon-star').click(function(){
        if(this.colortype === 0)
            this.colortype = 1;
        else
            this.colortype = 0;
    
        if(this.colortype === 0)
            $(this).attr("style","color:#FEC82E;");
        else
            $(this).css('color','#2A2A2A');
    });
});

var url = '';
function getFullPath(obj) {
    if (obj) {
        //Internet Explorer 
        var preview = document.getElementById('headPre');
        if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
            obj.select();
            return document.selection.createRange().text;
        } 
        //Firefox
        else if (window.navigator.userAgent.indexOf("Firefox") >= 1) { 
            if (obj.files) {
                console.log('firefox');
                url = window.URL.createObjectURL(obj.files.item(0));
                preview.style.backgroundImage = 'url('+window.URL.createObjectURL(obj.files.item(0))+')';
                return;
            }
        } 
    } 
}

function change(){
    var preview = document.getElementById('realHead');
    if (window.navigator.userAgent.indexOf("Firefox") >= 1) { 
        preview.style.backgroundImage = 'url('+url+')';
    }
    var div = document.getElementById('changeHead');
    div.style.visibility = "hidden";
} 


$(function(){
    $('.form_date').datetimepicker({
        language:  'cn',
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0,
        format: 'yyyy-mm-dd'
    });
});


//to change personal info and upload by ajax
function changeInfo(){
    let name = $('#userName').val();
    let sex = $("input[name='sex']:checked").val();
    let birthday = $('.form-control').val();
    let qq = $('#qqNum').val();
    let phone = $('#phoneNum').val();
    let github = $('#githubLin').val();
    let personalWeb = $('#personalWebLin').val();
    let sign = $('#perSign').val();

    console.log('name:'+name);
    console.log('sex:'+sex);
    console.log('birthday:'+birthday);
    console.log('qq:'+qq);
    console.log('phone:'+phone);
    console.log('github:'+github);
    console.log('personalWeb:'+personalWeb);
    console.log('sign:'+sign);

    $.ajax({
        url: '/idPage/modifyInfo',
        type:'POST',
        //cache:false,
        data:{
            name : name,
            sex :sex,
            birthday : birthday,//birthday format: 2017-09-01
            qq : qq,
            phone : phone,
            githubLink : github,
            personalWeb : personalWeb,
            sign : sign
        },
        //processData:false,
        //contentType:false,
        success:function(data){
            console.log('success!');
        }
    })
    var popUp = document.getElementById("changeInfo");
    popUp.style.visibility = "hidden";
}



