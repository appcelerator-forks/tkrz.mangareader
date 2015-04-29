var args = arguments[0] || {},
http = require('http'),
parserModule = require('pl.tkrz.mangareader.parser'),
string = require('alloy/string');

$.mangaList.search = Alloy.Globals.searchView;

function init(){
    if(args.type === 'list'){
        var list = Ti.App.Properties.getObject('list', null),
        lastUpdate = Ti.App.Properties.getInt('lastUpdate', 0);
        if(list === null && Ti.Network.online)
            refreshList();
        // else if((new Date().getTime() - lastUpdate) > 7*24*60*60*1000 &&  Ti.Network.online)
            // refreshList();
        else displayList(list);
    }
    else if(args.type === 'favs') {
        var favs = Ti.App.Properties.getObject('favs', []);
        Alloy.Globals.favoritesAddObj.on('update', function(){
            var favs = Ti.App.Properties.getObject('favs', []);
            $.mangaList.deleteSectionAt(0);
            displayList(favs);
        });
        displayList(favs);
    }
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
    if(args.type === 'list')
        var list = Ti.App.Properties.getObject('list');
    else if(args.type === 'favs')
        var list = Ti.App.Properties.getObject('favs');
	// alert("Manga title: " + list[e.itemIndex].properties.title + " Manga url: " + Alloy.CFG.links.base + list[e.itemIndex].properties.url);
	Alloy.createController('win/manga_details', {url: list[e.itemIndex].properties.url, title: list[e.itemIndex].properties.title}).getView().open();
};

function close(){
    Alloy.Globals.favoritesAddObj.off('update');
    $.manga_details.close();
}
