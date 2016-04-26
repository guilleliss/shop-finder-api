var express = require('express');
var router = express.Router();
var app = require('../app');

var jwt = require('jsonwebtoken');
var passwordHash = require('password-hash');

var mongoose = require('mongoose');
var User = mongoose.model('User');

/**
 * Saves a new user.
 */
router.post('/', function(req, res, next) {
	var new_user = new User({
		name: req.body.name,
		password: passwordHash.generate(req.body.password),
		email: req.body.email,
		admin: req.body.admin
	});

	new_user.save(function(err) {
		if (err) return next(err);
		res.json(new_user);
	});
});

/* Get all users */
router.get('/', function(req, res, next) {
	User.find({}, function(err, users) {
		if (err) return next(err);
		res.json(users);		
	});
});

/* Get details of specified user */
router.get('/:user_id', function(req, res, next) {
	User.findById(
		req.params.user_id,
		function (err, data) {
			if (err) return next(err);
			res.json(data);
	});	
});

/* Delete specified user */
router.delete('/:user_id', function(req, res, next) {
	User.remove({
		_id: req.params.user_id
	}, function (err, data) {
		if (err) { return next(err); }
		res.json(data);
	});		
});

module.exports = router;