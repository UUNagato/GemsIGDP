function showMess(event)
{
    var $input = $(event);
    $('.title-3').hide();
    $('.alert').hide();
    $('.glyphicon-ok').hide();
    $input.parent().parent().find('.title-3').show();
}

window.onload=function(){
    $('.title-3').hide();
}

function userid(event)
{
    var id = $(event).val();
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