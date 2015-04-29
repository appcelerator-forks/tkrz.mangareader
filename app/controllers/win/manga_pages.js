var chapters = arguments[0].chapters,
chapterIndex = arguments[0].chapterIndex,
pagesData,
parserModule = require('pl.tkrz.mangareader.parser');

$.loader.show();

function init () {
    require('http').getPage(loadPages, chapters[chapterIndex].url);
    var activity = $.manga_pages.activity;
    activity.actionBar.title = chapters[chapterIndex].title;
    activity.actionBar.setDisplayHomeAsUp(true);
    activity.actionBar.setHomeButtonEnabled(true);
    activity.actionBar.onHomeIconItemSelected = closeWindow;
    activity.onCreateOptionsMenu = function(e) {
        if(chapterIndex > 0){
            var menuPrevious = e.menu.add({
                title : "Previous",
                showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
                icon : '/images/ic_action_previous_item.png'
            });
            menuPrevious.addEventListener("click", previousChapter);
        }
        menuChapters = e.menu.add({
            title: 'Chptr ' + (chapterIndex + 1) + ' of ' + chapters.length,
            showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
        });
        menuChapters.addEventListener("click", showChapters);
        if(chapterIndex < chapters.length - 1) {
            var menuPrevious = e.menu.add({
                title : "Next",
                showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
                icon : '/images/ic_action_next_item.png'
            });
            menuPrevious.addEventListener("click", nextChapter);
        }
    };
    activity.invalidateOptionsMenu();
}

function loadPages (data) {
    pagesData = JSON.parse(parserModule.getPagesUrl(data));
    $.currentPage.text = "1/"+pagesData.length;
    var pages = Ti.UI.createScrollableView();
    _.forEach(pagesData, function(pageUrl){
        Ti.API.info(pageUrl);
        pages.addView(Alloy.createWidget("pl.tidev.mangareader.mangapage", "widget", pageUrl).getView());
    });
    pages.addEventListener('scroll', pageChange);
    $.container.add(pages);
    $.loader.hide();
}

function pageChange (e) {
    if(e.currentPage !== undefined)
        $.currentPage.text = (e.currentPage + 1) + "/" + pagesData.length;
}

function previousChapter() {
    $.container.removeAllChildren();
    $.loader.show();
    chapterIndex -= 1;
    init();
}

function nextChapter() {
    $.container.removeAllChildren();
    $.loader.show();
    chapterIndex += 1;
    init();
}

function showChapters() {
    var options = [];
    _.forEach(chapters, function(chapter){
        options.push(chapter.title);
    });
    var dialog = Ti.UI.createOptionDialog({
        title: "Go to chapter",
        options: options,
        selectedIndex: chapterIndex,
        buttonNames: ["OK"]
    });
    dialog.addEventListener('click', function (e) {
        if(!e.button && e.index !== undefined) {
            $.container.removeAllChildren();
            $.loader.show();
            chapterIndex = e.index;
            init();
        }
    });
    dialog.show();
}

function closeWindow() {
    $.manga_pages.close();
}

$.manga_pages.open();
