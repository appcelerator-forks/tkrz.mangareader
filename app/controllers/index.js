var mangaList = Alloy.createController('win/manga_list'),
search = Alloy.createController('searchview').getView();
mangaList.mangaList.searchView = search;
$.index.addTab(Ti.UI.createTab({title: 'manga list', window: mangaList.getView()}));

function init(){
    var activity = $.index.getActivity();
    activity.onCreateOptionsMenu = function (e) {
        e.menu.add({
            title: "Manga Search",
            icon: Ti.Android.R.drawable.ic_action_search,
            actionView: search,
            showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS | Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
        });
    };
}

$.index.open();