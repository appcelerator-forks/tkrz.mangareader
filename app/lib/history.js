exports.historyContainer = {};
var historyFilePath = Ti.Filesystem.applicationDataDirectory + "history";

_.extend(exports, Backbone.Events);

function init(){
	var history = Ti.Filesystem.getFile(historyFilePath).read().text;
	Ti.API.info("History file content: " + history);
	if(history == ""){
		exports.historyContainer = {};
	}
	else {
		exports.historyContainer = JSON.parse(history);
	}
}

function setTitle(title, data){
	var historyFile = Ti.Filesystem.getFile(historyFilePath);
	if(!data)
		exports.historyContainer[title] = {
			latestChapter: {
				index: 0,
				chapterUrl: "",
				page: 0
			},
			url: url
		};
	else {
		exports.historyContainer[title] = data;
	}
	saveHistory();
	exports.trigger("change", exports.historyContainer);
}

function getTitle(title){
	var titl = exports.historyContainer[title];
	if(!titl)
		return {
			latestChapter: {
				index: 0,
				chapterUrl: "",
				page: 0
			},
			url: ""
		};
	else
		return titl;
}

function markLastChapter(title, chapterData){
	exports.historyContainer[title].latestChapter.index = chapterData.index;
	exports.historyContainer[title].latestChapter.chapterUrl = chapterData.url;
	exports.historyContainer[title].latestChapter.page = chapterData.page;
	saveHistory();
	exports.trigger("change", exports.historyContainer);
}

function markLastPage(title, page){
	exports.historyContainer[title].latestChapter.page = page;
	saveHistory();
	exports.trigger("change", exports.historyContainer);
}

function saveHistory(){
	Ti.Filesystem.getFile(historyFilePath).write(JSON.stringify(exports.historyContainer));
}

exports.init = init;
exports.setTitle = setTitle;
exports.getTitle = getTitle;
exports.markLastChapter = markLastChapter;
exports.markLastPage = markLastPage;
