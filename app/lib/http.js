var links = require('alloy').CFG.links;

exports.list = function(success, error){
    var xhr = Ti.Network.createHTTPClient();
    xhr.onload = function(){
        Ti.API.info('Success');
        success(this.responseText);
    };
    xhr.error = function(){
        Ti.API.error("Connection error status: "+this.status);
    };
    xhr.onreadystatechange = function(){
        var state = '';
        switch(this.readyState){
            case 0:
            state = "unsent";
            break;
            case 1:
            state = "opened";
            break;
            case 2:
            state = "received headers";
            break;
            case 3:
            state = "loading";
            break;
            case 4:
            state = "done";
            break;
            default:
            // state = Ti.Network.HTTPClient.DONE;
            break;
        }
        Ti.API.info('State changed: '+state);
    };
    xhr.open('GET', links.list);
    xhr.setRequestHeader('Content-Type', 'text/html');
    xhr.send();
    
};
