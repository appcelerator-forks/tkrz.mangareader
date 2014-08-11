var args = arguments[0] || {};
var http = require('http');
var parserModule = require('pl.tkrz.mangareader.parser');
var string = require('alloy/string');

function init(){
    $.activityIndicator.show();
    http.list(loadData);
}

function loadData(data){
	var string = JSON.stringify(data);
    var list = parserModule.parseHtml(data);
    list = JSON.parse(list);
    $.activityIndicator.hide();
    displayList(list);
}

function displayList(list){
	Ti.API.info(JSON.stringify(list));
	var manga = Ti.UI.createListSection({
		items: list
	});
	$.mangaList.appendSection(manga);
}

function openTitle(e){
	alert(JSON.stringify(e));
};
