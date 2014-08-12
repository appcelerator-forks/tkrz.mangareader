var args = arguments[0] || {};
var titleUrl = args.url;
var mangaTitle = args.title;
var http = require('http');

$.manga_details.title = mangaTitle;

function init(){
	$.activityIndicator.show();
	http.getPage(loadData, titleUrl);
	var actionBar = $.manga_details.activity.getActionBar();
	actionBar.title = mangaTitle;
	actionBar.setDisplayHomeAsUp(true);
	actionBar.setHomeButtonEnabled(true);
	actionBar.onHomeIconItemSelected = closeWindow;
}

function loadData(data){
	$.activityIndicator.hide();
};

function closeWindow(){
	$.manga_details.close();
}
