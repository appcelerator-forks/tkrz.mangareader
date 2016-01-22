var mangaList = Alloy.createController('win/manga_list', {type: 'list'}),
favoritesList = Alloy.createController('win/manga_list', {type: 'favs'}),
historyList = Alloy.createController('win/manga_list', {type: 'hist'}),
search = Alloy.createController('searchview').getView();

mangaList.mangaList.searchView = search;

$.index.addTab(Ti.UI.createTab({title: 'manga list', window: mangaList.getView()}));
$.index.addTab(Ti.UI.createTab({title: 'favorites', window: favoritesList.getView()}));
$.index.addTab(Ti.UI.createTab({title: 'history', window: historyList.getView()}));

function init(){
    var activity = $.index.getActivity();
    activity.onCreateOptionsMenu = function (e) {
        e.menu.add({
            title: "Manga Search",
            icon: '/images/ic_action_search.png',
            actionView: search,
            showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS | Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
        });
        var about = e.menu.add({
           title: "About" 
        });
        about.addEventListener('click', showAbout);
    };
    require("history").init();
}

function showAbout() {
    Alloy.createWidget('pl.tidev.mangareader.aboutdialog').getView().show();
   
}

$.index.open();