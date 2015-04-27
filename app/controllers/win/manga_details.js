var args = arguments[0] || {},
titleUrl = args.url;
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
	Ti.API.info(JSON.stringify(details.chapters));
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
	$.description.text = details.summary;
	$.activityIndicator.hide();
	$.content.show();
};

// /**
 // * Returns property string in format: "propertyName propertyValue" from properties object. Param "name" is string wit corresponding property name from
 // * mangareader.net manga details page like "Author:". 
 // * @param {String} name
 // * @param {Object} properties
 // */
// 
// function getProperty(name, properties){
    // var prop;
    // for (var i = 0; i < properties.length; i++){
        // _.map(properties[i], function(value, key){
            // if(key == name){
                // prop =  key + ' ' + value;
                // return true;
            // }
            // else return false;
        // });
    // }
    // return prop[0];
// }

function readChapter() {
    
}

function closeWindow(){
	$.manga_details.close();
}
