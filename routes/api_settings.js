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
			// console.log(lang);
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
	if(object.hasOwnProperty('title') && typeof object.title == 'object') {
		if(object.title.hasOwnProperty(lang)) {
			object.title = object.title[lang];
		}
		result.push(object.title);
	} else if(object.hasOwnProperty('appShareMessage') && typeof object.appShareMessage == 'object') {
		if(object.appShareMessage.hasOwnProperty(lang)) {
			object.appShareMessage = object.appShareMessage[lang];
		}
		result.push(object.appShareMessage);
	}

	for(var i=0; i< Object.keys(object).length; i++) {
		if(typeof object[Object.keys(object)[i]] == "object") {
			customFilter(object[Object.keys(object)[i]], result, lang);
		}
	}
}

/* Get settings for the client app */
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