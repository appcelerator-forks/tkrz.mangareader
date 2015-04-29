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
	http.getPage(loadData, titleUrl);
	var activity = $.manga_details.activity;
	activity.actionBar.title = mangaTitle;
	activity.actionBar.setDisplayHomeAsUp(true);
	activity.actionBar.setHomeButtonEnabled(true);
	activity.actionBar.onHomeIconItemSelected = closeWindow;
	activity.onCreateOptionsMenu = function(e) {
        if(isFav()){
            var menuFavAdd = e.menu.add({
                title : "Remove favorite"
            });
            menuFavAdd.addEventListener("click", toggleFav);
        }
        else {
            var menuFavRemove = e.menu.add({
                title : "Add favorite"
            });
            menuFavRemove.addEventListener("click", toggleFav);
        }
    };
	activity.invalidateOptionsMenu();
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

function toggleFav() {
    var favs = Ti.App.Properties.getObject('favs', []);
    if(!isFav()) {
        favs.push({properties: {url: titleUrl, title: mangaTitle, searchableText: mangaTitle}});
        Ti.App.Properties.setObject('favs', favs);
        $.manga_details.activity.invalidateOptionsMenu();
        Alloy.Globals.favoritesAddObj.trigger('update');
        Ti.UI.createNotification({
            message: 'Added to favorites'
        }).show();
    }
    else {
        var removeId = [];
        _.forEach(favs, function(fav, index){
            if(fav.properties.title === mangaTitle)
                favs.splice(index, 1);
        });
        Ti.App.Properties.setObject('favs', favs);
        $.manga_details.activity.invalidateOptionsMenu();
        Alloy.Globals.favoritesAddObj.trigger('update');
        Ti.UI.createNotification({
            message: 'Removed from favorites'
        }).show();
    }
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
