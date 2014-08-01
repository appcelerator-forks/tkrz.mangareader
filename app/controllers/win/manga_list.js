var args = arguments[0] || {};
var http = require('http');

function init(){
    $.activityIndicator.show();
    http.list(loadData);
}

function loadData(data){
    Ti.API.info(JSON.stringify(data));
    $.activityIndicator.hide();
}
