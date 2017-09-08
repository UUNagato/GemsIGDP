function showMess(event)
{
    var $input = $(event);
    var div = $input.parent().parent();
    
    $('.title-3').hide();

    //when info of alert or ok is hidden, the title-3 info will show
    if(div.find('.alert').is(':hidden') && div.find('.glyphicon-ok').is(':hidden'))
        div.find('.title-3').show();
    
    //$('.glyphicon-ok').hide();
    // $input.parent().parent().find('.title-3').show();
}

window.onload=function(){
    $('.title-3').hide();
}


function userid(event)
{
    var id = $(event).val();
    var input = $(event);
    var div = input.parent().parent();
    
    var reg=/^([a-zA-Z0-9_-])+/; 
    if(!reg.test(id))
    {
        div.find('.title-3').hide();
        div.find('.alert').hide();
        div.find('.glyphicon-ok').hide();
        div.find('#alert-2').show();
    }
    else{
        $.ajax({
            type : "post",
            data : {
                name : id
            },
            dataType : "text",
            url : "/register/checkId",
            success : function(data){
                if(data == 'success'){
                    //
                    console.log('success');
                    console.log(div.find('.title3').text());
                    div.find('.title-3').hide();
                    div.find('.alert').hide();
                    div.find('.glyphicon-ok').show();
                }else{
                    //
                    console.log("fail");
                    div.find('.glyphicon-ok').hide();
                    div.find('.title-3').hide();
                    div.find('.alert').show();
                }
            }
        });
    }


    

}

function email(event)
{
    var email = $(event).val();
    var input = $(event);
    var div = input.parent().parent();
    
    /*$.ajax({
        type : "post",
        data : {
            id : id
        },
        dataType : "text",
        url : "",
        success : function(data){
            if(data == 'success'){
                //
                div.find('.title-3').hide();
                div.find('.glyphicon-ok').show();
            }else{
                //
                div.find('.title-3').hide();
                div.fing('alert').show();
            }
        }
    });*/
}

function password(event)
{
    var password = $(event).val();
    var input = $(event);
    var div = input.parent().parent();
    
    /*$.ajax({
        type : "post",
        data : {
            id : id
        },
        dataType : "text",
        url : "",
        success : function(data){
            if(data == 'success'){
                //
                div.find('.title-3').hide();
                div.find('.glyphicon-ok').show();
            }else{
                //
                div.find('.title-3').hide();
                div.fing('alert').show();
            }
        }
    });*/
}


function passLen(event)
{
    var password = $(event).val();
    var input = $(event);
    var div = input.parent().parent();
    if($(event).val().length < 6 || $(event).val().length > 16)
    {
            div.find('.title-3').hide();
            div.find('.glyphicon-ok').hide();
            div.find('.alert').show();
    }
    else
    {
        div.find('.alert').hide();
        div.find('.glyphicon-ok').show();
    }

}

function passwordRe(event)
{
    var passwordRe = $(event).val();
    var input = $(event);
    var div = input.parent().parent();
    
    /*$.ajax({
        type : "post",
        data : {
            id : id
        },
        dataType : "text",
        url : "",
        success : function(data){
            if(data == 'success'){
                //
                div.find('.title-3').hide();
                div.find('.glyphicon-ok').show();
            }else{
                //
                div.find('.title-3').hide();
                div.fing('alert').show();
            }
        }
    });*/
}