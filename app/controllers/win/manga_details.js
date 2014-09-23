var args = arguments[0] || {};
var titleUrl = args.url;
var mangaTitle = args.title;
var http = require('http');
var parserModule = require('pl.tkrz.mangareader.parser');

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
	var details = JSON.parse(parserModule.parseMangaDetails(data));
	Ti.API.info(JSON.stringify(details));
	$.mangaImg.image = details.imageUrl;
	$.description.setItems([
		{
			info: {
				text: details.summary
			},
			template: 'description'
		}
	]);
	$.chapters.setItems(details.chapters);
	$.activityIndicator.hide();
	$.content.show();
};

function closeWindow(){
	$.manga_details.close();
}
