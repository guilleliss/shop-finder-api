var express = require('express');
var router = express.Router();
var app = require('../app');

var jwt = require('jsonwebtoken');
var passwordHash = require('password-hash');

var mongoose = require('mongoose');

var User = mongoose.model('User');

/* 
 * Authentication route, validates user and
 * returns token
 */
router.post('/authenticate', function(req, res) {
	// find the user
	User.findOne({
		name: req.body.name
	}, function(err, user) {

		if (err) throw err;

		if (!user) {
		  res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {
			
			// check if password matches
			if (!passwordHash.verify(req.body.password, user.password)) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {
				// if user is found and password is right
				// create a token
				var token = jwt.sign(user, req.app.get('superSecret'), {
				  expiresIn: 86400 // expires in 24 hours
				});

				// return the information including token as JSON
				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}
		}
	});

});

/* Middleware for authentication */
router.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, req.app.get('superSecret'), function(err, decoded) {      
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });    
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token, return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });
    }
});

module.exports = router;