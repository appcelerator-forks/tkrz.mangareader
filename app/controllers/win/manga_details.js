var args = arguments[0] || {},
titleUrl = args.url,
mangaTitle = args.title,
http = require('http'),
parserModule = require('pl.tkrz.mangareader.parser'),
chapters = [],
chapterIndex = 0;

$.manga_details.title = mangaTitle;

function init(){
	$.activityIndicator.show();
	// if(isFav()) {
	    // $.addToFav.icon = Ti.Android.R.drawable.ic_action_bad;
	// }
	// else
        // $.addToFav.icon = Ti.Android.R.drawable.ic_action_bad;
	http.getPage(loadData, titleUrl);
	var actionBar = $.manga_details.activity.getActionBar();
	actionBar.title = mangaTitle;
	actionBar.setDisplayHomeAsUp(true);
	actionBar.setHomeButtonEnabled(true);
	actionBar.onHomeIconItemSelected = closeWindow;
	$.manga_details.activity.invalidateOptionsMenu();
}

function loadData(data){
	var details = JSON.parse(parserModule.parseMangaDetails(data));
	Ti.API.info(JSON.stringify(details.chapters));
	chapters = details.chapters;
	$.mangaImg.image = details.imageUrl;
	$.author.text = "Author: " + details.properties["Author:"];
	$.year.text = "Year of release: " + details.properties["Year of Release:"];
	$.status.text = "Status: " + details.properties["Status:"];
	$.chapterCount.text = "Chapters: " + details.chapters.length;
	var pickerData = [];
	for (var i = 0, l = details.chapters.length; i < l; i++) {
	    pickerData.push(Ti.UI.createPickerRow({title: details.chapters[i].title}));
	}
	$.chaptersPicker.add(pickerData);
	if(pickerData.length > 1){
	   $.chaptersPicker.setSelectedRow(0, 1, false);
       $.chaptersPicker.setSelectedRow(0, 0, false);
    }
	$.description.text = details.summary;
	$.activityIndicator.hide();
	$.content.show();
};

function addToFav() {
    if(!isFav()) {
        var favs = Ti.App.Properties.getObject('favs', []);
        favs.push({properties: {url: titleUrl, title: mangaTitle, searchableText: mangaTitle}});
        Ti.App.Properties.setObject('favs', favs);
        Alloy.Globals.favoritesAddObj.trigger('update');
        Ti.UI.createNotification({
            message: 'Added to favorites'
        }).show();
    }
    else
        Ti.UI.createNotification({
            message: 'Already in favorites'
        }).show();
}

function chapterSelect (e) {
    Ti.API.info(e.rowIndex);
    chapterIndex = e.rowIndex;
}

function readChapter() {
    Alloy.createController('win/manga_pages', {chapterIndex: chapterIndex, chapters: chapters});
}

function isFav () {
    var favs = Ti.App.Properties.getObject('favs', []),
    ret = false;
    _.forEach(favs, function(item){
        Ti.API.info(JSON.stringify(item));
        if(item.properties.title === mangaTitle)
            ret = true;
    });
    return ret;
}

function closeWindow(){
	$.manga_details.close();
}
