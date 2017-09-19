function onKeyDown(event){
    var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode==27){ // 按 Esc 
            //要做的事情
    }
        if(e && e.keyCode==113){ // 按 F2 
    //要做的事情
    }            
    if(e && e.keyCode==13){ // enter 键
            alert("此处回车触发搜索事件");
        }
    
};

$().ready(function(){
    if(isLocallyLogin()===true)
    {
        document.getElementById('first').style.display='block';
        document.getElementById('second').style.display='block';
    }else{
        document.getElementById('first').style.display='none';
        document.getElementById('second').style.display='none';
    }
});