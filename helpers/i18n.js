'use strict';

var fs = require('fs');
var path = require('path');
var Gettext = require('node-gettext');
var gettextParser = require('gettext-parser');

const translationsDir = '../TwainBB/locales';
const locales = ['en'];
const domain = 'main';

var gt = new Gettext();

locales.forEach((locale) => {
	const fileName = 'main.po';
	const translationsFilePath = path.join(translationsDir, locale, fileName);
	const translationsContent = fs.readFileSync(translationsFilePath);

	const parsedTranslations = gettextParser.po.parse(translationsContent);
	gt.addTranslations(locale, domain, parsedTranslations);
});

gt.domain = 'main';
gt.locale = 'en';

module.exports = gt;
