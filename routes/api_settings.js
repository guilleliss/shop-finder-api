'use strict';

var express = require('express');
var router = express.Router();
var app = require('../app');

var mongoose = require('mongoose');
var AppSettings = mongoose.model('AppSettings');

/* Get settings for the client app given a lang parameter */
router.get('/', function(req, res) {
	AppSettings.findOne({}, function(err, appSettings) {
		if (err) return next(err);

		var lang = 'en';
		if(req.query.lang) {
			lang = req.query.lang;
		}

		var result = [];
		customFilter(appSettings.settings, result, lang);
		// console.log(result);

		res.json(appSettings.settings);
	});

});

/* Get full settings for the dashboard */
router.get('/full', function(req, res) {
	AppSettings.findOne({}, function(err, appSettings) {
		if (err) return next(err);
		res.json(appSettings.settings);
	});
});

function customFilter(object, result, lang) {
	['title', 'appShareMessage'].forEach(function(prop, i, a) {
		if(object.hasOwnProperty(prop)) {
			object[prop] = filterLangObject(object[prop], lang);
			result.push(object[prop]);
		}
	});

	var keyRegex = /^str_/;

	for(var key in object) {
		if(typeof object[key] == "object") {
			if (key.match(keyRegex)) {
				object[key] = filterLangObject(object[key], lang);
				result.push(object[key]);
			} else {
				customFilter(object[key], result, lang);
			}
		}
	}
}

function filterLangObject(stringObject, lang) {
	var default_lang = 'en';
	if(typeof stringObject == "object") {
		if(stringObject.hasOwnProperty(lang)) {
			stringObject = stringObject[lang];
		} else {
			stringObject = stringObject[default_lang];
		}
	}
	return stringObject;
}

/* Save settings */
router.post('/', function(req, res, next) {
	AppSettings.findOne({}, function(err, appSettings) {
		if (err) return next(err);
		if(appSettings != null) {
			appSettings.settings = req.body;
			appSettings.settings.updated = Date.now();
			appSettings.save(function(err, data) {
				res.json(data);
			});
		} else {
			var newSettings = new AppSettings({
				settings: req.body
			});
			newSettings.settings.updated = Date.now();
			newSettings.save(function(err, data) {
				res.json(data);
			});
		}
	});
});

module.exports = router;