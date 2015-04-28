var pageUrl = arguments[0];

$.loader.show();

require('http').getPage(getImage, pageUrl);

function getImage (data) {
    $.page.image = require('pl.tkrz.mangareader.parser').getImageUrl(data);
}

function hideLoader() {
    $.loader.hide();
}
