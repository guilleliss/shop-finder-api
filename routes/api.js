var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Shop = mongoose.model('Shop');
var Review = mongoose.model('Review');

var ngeohash = require('ngeohash');

/* GET home page. */
router.get('/', function(req, res) {
	res.json({ message: 'Welcome to the api' });
});

/* Get a list of all shops */
router.get('/shops', function(req, res) {
	Shop.find({}, function (err, data) {
		if (err) return console.error(err);
		var retShops = [];
		for (var i = 0; i < data.length; i++) {
			if (data[i]["opening_hours"] && data[i]["opening_hours"]["periods"]) {
				delete data[i]["opening_hours"]["periods"];
			}
			retShops.push(data[i]);
		};
		res.json(retShops);
	});
});

/* Save a new shop, and its reviews */
router.post('/shops', function(req, res) {
	var reviews = req.body.reviews;
	var reviews_count = 0;

	if(reviews) {
		reviews_count = reviews.length;
	}

	var geohash = encodeCoords(req.body.geolocation);

	var newShop = new Shop({
		name: req.body.name,
		description: req.body.description,
		address: req.body.address,
		phone_number: req.body.phone_number,
		opening_hours: req.body.opening_hours,
		website: req.body.website,
		photos: req.body.photos,
		geolocation: {
			geohash: geohash,
			location: req.body.geolocation	
		},
		hidden: false,
		source: req.body.source,
		source_id: req.body.source_id,
		rating: req.body.rating,
		price_level: req.body.price_level,
		reviews_count: reviews_count
	});


	newShop.save(function(err, shop) {
		if (err) {
			console.log("error:" + err);
			res.send(err);
		}

		/* If the shop brings reviews, we save each */
		if(reviews) {		
			for (var i = 0; i < reviews_count; i++) {
				var newReview = new Review({
					shop_id: shop._id,
					rating: reviews[i].rating,
					text: reviews[i].text,
					time: reviews[i].time
				});

				newReview.save(function(err, review) {
					if (err) {
						console.log("error:" + err);
						res.send(err);
					}
				});
			};
		};

		res.json(shop);
	});	
});

/* Get a shops detail by id, but not its reviews  */
router.get('/shops/:shop_id', function(req, res) {
	Shop.findById(
		req.params.shop_id, 
		function (err, data) {
			if (err) return console.error(err);
			res.json(data);
	});	
});

/* Updates a shop details */
router.put('/shops/:shop_id', function(req, res) {
	Shop.findByIdAndUpdate(
		req.params.shop_id,
		{
			description: req.body.description
		},
		function (err, data) {
			if (err) return console.error(err);
			res.json(data);
	});	
});

/* Get all reviews  */
router.get('/reviews', function(req, res) {
	Review.find({
	}, function (err, data) {
		if (err) return console.error(err);
		res.json(data);
	});	
});

/* Get a list of a shop's reviews */
router.get('/shops/:shop_id/reviews', function(req, res) {
	Review.find({
		shop_id: req.params.shop_id 
	}, function (err, data) {
			if (err) return console.error(err);
			res.json(data);
	});
});

/* Check if a shop exists given its source id
 * (ie, Google Places ID)
 */
router.get('/shops/exists/:source_id', function(req, res) {
	Shop.find({
		source_id: req.params.source_id
	},
	function (err, data) {
		if (err) return console.error(err);
		res.json(data.length > 0);
	});
});

/* Remove a stored shop given its id */
router.delete('/shops/:shop_id', function(req, res) {
	Shop.remove({
		_id: req.params.shop_id
	}, function (err, data) {
		if (err) {
			res.send(err);
			return;
		}

		/* We remove all its reviews as well */
		Review.remove({
			shop_id: req.params.shop_id
		}, function (err, data) {
			if (err) {
				res.send(err);
				return;
			}
			// console.log(data);
			res.json(data);
		});

		// res.json(data);
	});
});

/* Empty the DB, removes all shops and reviews */
router.get('/removeall', function(req, res) {
	Shop.remove({}, function(err) { 
		Review.remove({}, function(err) { 
			res.json({ message: 'All data removed' });
		});
	});
});

router.get('/settings', function(req, res) {
	var settingsJson = {
	title: "Settings",
	table: {
		backgroundColor: "#FFFFFF",
		sections: [
			{ name: "SUPPORT",  data: [
				{ 
					title : "Help and Feedback",
					icon: { class: 1, type: 1, color : "#2CA390"},
					action : { type: "link", data:"http://barkalastudios.com"}
				},
				{
					title : "Email Us",
					icon: { class: 1, type: 1, color : "#2CA390"},
					action : { type: "dlink", data : { dlink:"mailto:hello@barkalastudios.com?subject=Greetings%20from%20Cupertino!&body=Wish%20you%20were%20here!"}}

				},
				{   
					title : "Add Features",
					icon: { class: 1, type: 1, color : "#2CA390"},
					action : { type: "mail", data : {to:"hello@appname.com",subject:"Email Us", body:"html body"}}
				} 
			]},
			{ name: "SOCIAL",  data: [
				{ 
					title : "Rate this App",
					icon: { class: 1, type: 1, color : "#2CA390"},
					action : { type:"dlink", data :{dlink:"http://itunes.apple.com/app/id378458261",
					   link:"http://itunes.apple.com/app/id378458261", appName:"App Store"}}
				},
				{
					title : "Follow Us on Twitter",
					icon: { class: 1, type: 1, color : "#2CA390"},
					action : { type:"dlink", data:{ dlink:"twitter:///user?screen_name=spiritsciences",link:"https://twitter.com/spiritsciences", appName:"Twitter"}}
				},
				{
					title : "Like Us on Facebook",
					icon: { class: 1, type: 1, color : "#2CA390"},
					action : { type:"dlink", data:{ dlink:"fb://profile/113810631976867", link:"https://www.facebook.com/thespiritscience", appName:"Facebook"}}
				},
				{
					title : "Terms of Service",
					icon: { class: 1, type: 1, color : "#2CA390"},
					action : { type:"link", data:"http://barkalastudios.com"}
				},
				{
					title : "Privacy Policy",
					icon: { class: 1, type: 1, color : "#2CA390"},
					action : { type:"link", data:"http://barkalastudios.com"}
				},
			]},
		]}
	};
	res.json(settingsJson);
});

/**
 * Encodes coordantes. Parameter should be a json
 * with lan and lon parameters.
 */
function encodeCoords(location) {
	return ngeohash.encode(location['lat'], location['lng']);
}

/* TODO: Remove all from here */
var GooglePlaces = require('google-places');
var places = new GooglePlaces('AIzaSyCAPKkCs0gnsuZia_W_d7oZn8hx-xkJGW0');

module.exports = router;