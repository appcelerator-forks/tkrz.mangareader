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
	$.author.text = getProperty("Author:", details.properties);
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

/**
 * Returns property string in format: "propertyName propertyValue" from properties object. Param "name" is string wit corresponding property name from
 * mangareader.net manga details page like "Author:". 
 * @param {String} name
 * @param {Object} properties
 */

function getProperty(name, properties){
    var prop;
    for (var i = 0; i < properties.length; i++){
        _.map(properties[i], function(value, key){
            if(key == name){
                prop =  key + ' ' + value;
                return true;
            }
            else return false;
        });
    }
    return prop[0];
}

function closeWindow(){
	$.manga_details.close();
}
