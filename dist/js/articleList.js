$().ready(function(){
    var login = isLocallyLogin();
    if(login)
        {
            document.getElementById("fabubtn").style.display="";
        }
    else
        {
            document.getElementById("fabubtn").style.display="none";
        }
});