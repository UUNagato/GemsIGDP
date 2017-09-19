function getDateTime(date){
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();

    month = month < 10 ? '0'+month :month;
    day = day < 10 ? '0'+day :day;
    h = h < 10 ? '0'+h :h;
    m = m < 10 ? '0'+m :m;
    s = s < 10 ? '0'+s :s;
 
    return year+'/'+month+'/'+day+' '+h+':'+m+':'+s;
};

module.exports = {
    getDateTime : getDateTime
};