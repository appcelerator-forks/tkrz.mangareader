var mangaList = Alloy.createController('win/manga_list', {type: 'list'}),
favoritesList = Alloy.createController('win/manga_list', {type: 'favs'}),
search = Alloy.createController('searchview').getView();
mangaList.mangaList.searchView = search;
$.index.addTab(Ti.UI.createTab({title: 'manga list', window: mangaList.getView()}));
$.index.addTab(Ti.UI.createTab({title: 'favorites', window: favoritesList.getView()}));

function init(){
    var activity = $.index.getActivity();
    activity.onCreateOptionsMenu = function (e) {
        e.menu.add({
            title: "Manga Search",
            icon: '/images/ic_action_search.png',
            actionView: search,
            showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS | Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
        });
    };
}

$.index.open();