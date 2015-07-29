var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Shop = mongoose.model('Shop');
var Review = mongoose.model('Review');

/* GET home page. */
router.get('/', function(req, res) {
	res.json({ message: 'Welcome to the api' });
});

router.get('/shops', function(req, res) {

	Shop.find({
	}, function (err, data) {
		if (err) return console.error(err);
		res.json(data);
	});	
});

router.post('/shops', function(req, res) {
	var reviews = req.body.reviews;
	var reviews_count = 0;

	if(reviews) {
		reviews_count = reviews.length;
	}

	var newShop = new Shop({
		name: req.body.name,
		description: req.body.description,
		address: req.body.address,
		phone_number: req.body.phone_number,
		opening_hours: req.body.opening_hours,
		website: req.body.website,
		photos: req.body.photos,
		geolocation: req.body.geolocation,
		hidden: false,
		source: req.body.source,
		source_id: req.body.source_id,
		rating: req.body.rating,
		price_level: req.body.price_level,
		reviews_count: reviews_count
	});


	newShop.save(function(err, shop) {
		if (err) res.send(shop);

		if(reviews) {		
			for (var i = 0; i < reviews_count; i++) {
				var newReview = new Review({
					shop_id: shop._id,
					rating: reviews[i].rating,
					text: reviews[i].text,
					time: reviews[i].time
				});

				newReview.save(function(err, review) {
					if (err) res.send(review);
				});
			};
		};

		res.json(shop);
	});	
});

router.get('/shops/:shop_id', function(req, res) {
	Shop.findById(
		req.params.shop_id, 
		function (err, data) {
			if (err) return console.error(err);
			res.json(data);
	});	
});

router.get('/reviews', function(req, res) {
	Review.find({
	}, function (err, data) {
		if (err) return console.error(err);
		res.json(data);
	});	
});

router.get('/shops/:shop_id/reviews', function(req, res) {
	Review.find({
		shop_id: req.params.shop_id 
	}, function (err, data) {
			if (err) return console.error(err);
			res.json(data);
	});	
});

router.get('/shops/exists/:source_id', function(req, res) {
	Shop.find({
		source_id: req.params.source_id
	},
	function (err, data) {
		if (err) return console.error(err);
		res.json(data.length > 0);
	});
});

router.delete('/shops/:shop_id', function(req, res) {
	Shop.remove({
		_id: req.params.shop_id
	}, function (err, data) {
		if (err) res.send(err);

		Review.remove({
			shop_id: req.params.shop_id
		}, function (err, data) {
			if (err) res.send(err);
				res.json(data);
		});

		res.json(data);
	});
});

router.get('/removeall', function(req, res) {
	Shop.remove({}, function(err) { 
		console.log('collection removed') 
	});
	Review.remove({}, function(err) { 
		console.log('collection removed') 
	});
});

/* TODO: Remove all from here */
var GooglePlaces = require('google-places');
var places = new GooglePlaces('AIzaSyCAPKkCs0gnsuZia_W_d7oZn8hx-xkJGW0');

module.exports = router;