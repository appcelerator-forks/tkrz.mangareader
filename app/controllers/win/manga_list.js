var args = arguments[0] || {},
http = require('http'),
parserModule = require('pl.tkrz.mangareader.parser'),
string = require('alloy/string');

$.mangaList.search = Alloy.Globals.searchView;

function init(){
    switch(args.type){
    	case 'favs':
	        var favs = Ti.App.Properties.getObject('favs', []);
	        Alloy.Globals.favoritesAddObj.on('update', function(){
	            var favs = Ti.App.Properties.getObject('favs', []);
	            $.mangaList.deleteSectionAt(0);
	            displayList(favs);
	        });
	        displayList(favs);
	        break;
        case "hist":
			var history = require("history");
		 	history.on("change", function (historyData) {
	            $.mangaList.deleteSectionAt(0);
		 		loadHistory(historyData);
		 	});
		 	loadHistory(history.historyContainer);
        	break;
    	case 'list':
	    default:
	        var list = Ti.App.Properties.getObject('list', null),
	        lastUpdate = Ti.App.Properties.getInt('lastUpdate', 0);
	        if(list === null && Ti.Network.online)
            	refreshList();
	        else displayList(list);
	    	break;
    }
}

function loadHistory(history){
 	var items = [];
 	_.each(history, function (titleData, title) {
 		// Ti.API.info(JSON.stringify(titleData));
 		items.push({properties: {url: titleData.url, title: title, subtitle: "Last chapter: " + (titleData.latestChapter.index + 1), searchableText: title}});
 	});
 	displayList(items);
}

function refreshList(){
	$.mangaList.hide();
    $.activityIndicator.show();
    http.list(loadData);
};

function loadData(data){
	var string = JSON.stringify(data);
    var list = parserModule.parseMangaList(data);
    list = JSON.parse(list);
    displayList(list);
    Ti.App.Properties.setObject('list', list);
    Ti.App.Properties.setInt('lastUpdate', new Date().getTime());
}

function displayList(list){
	Ti.API.info(JSON.stringify(list));
	var manga = Ti.UI.createListSection({
	    items: list
	});
	$.mangaList.appendSection(manga);
    $.activityIndicator.hide();
    $.mangaList.show();
}

function noresults() {
    Ti.UI.createNotification({
        message: 'Nothing found'
    }).show();
}

function openTitle(e){
	var list = e.section.items;
	// alert("Manga title: " + list[e.itemIndex].properties.title + " Manga url: " + Alloy.CFG.links.base + list[e.itemIndex].properties.url);
	Alloy.createController('win/manga_details', {url: list[e.itemIndex].properties.url, title: list[e.itemIndex].properties.title}).getView().open();
};

function close(){
    Alloy.Globals.favoritesAddObj.off('update');
    $.manga_details.close();
}
