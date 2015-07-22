var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Shop = mongoose.model('Shop');

/* GET home page. */
router.get('/', function(req, res) {
  res.json({ message: 'Welcome to the api' });
});

router.get('/shops', function(req, res) {

	// Shop.remove({}, function(err) { 
	// 	console.log('collection removed') 
	// });

	Shop.find({
		// boolean: false
	}, function (err, data) {
		if (err) return console.error(err);
		res.json(data);
	});	
});

router.post('/shops', function(req, res) {
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
	});

	newShop.save(function(err, todo) {
		if (err) res.send(err);
		res.json(todo);
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
			res.json(data);
	});
});


/* TODO: Remove all from here */
var GooglePlaces = require('google-places');
var places = new GooglePlaces('AIzaSyCAPKkCs0gnsuZia_W_d7oZn8hx-xkJGW0');

router.get('/populate/:keyword', function(req, res) {
	places.search({keyword: req.params.keyword, location: [40.414142,-3.703738], radius: 500}, function(err, response) {
		if(err) { console.log(err); return; }
		
		for (i = 0; i < response.results.length; i++) { 

			var shopPhotos = [];
			if(response.results[i].photos) {
				
				// places.details({placeid: response.results[i].place_id}, function(err, response) {
				// 	if(err) { console.log(err); return; }

				// 	for (j = 0; j < response.result.photos.length; j++) { 
				// 		places.photo({photoreference: response.result.photos[j].photo_reference, maxwidth: 400}, function(err, response) {
				// 			if(err) { console.log(err); return; }
				// 			shopPhotos.push(response);
				// 		});
				// 	}
				// });

				shopPhotos.push(buildPhotoUrl(response.results[i].photos[0].photo_reference, 400));
			}


			var newShop = new Shop({
				name: response.results[i].name,
				address: response.results[i].vicinity,
				geolocation: response.results[i].geometry.location,
				hidden: false,
				source: "Google",
				source_id: response.results[i].place_id,
				photos: shopPhotos
			});

			newShop.save(function(err, shop) {
				if (err) res.send(err);
				console.log(shop);
			});	
		}


		res.json(response.results);
	});
});

function buildPhotoUrl (reference, width) {
	var apiKey = "AIzaSyCAPKkCs0gnsuZia_W_d7oZn8hx-xkJGW0";
	var baseUrl = "https://maps.googleapis.com/maps/api/place/photo?"
	return baseUrl + "photoreference=" + reference + "&key=" + apiKey + "&maxwidth=" + width;
}

module.exports = router;