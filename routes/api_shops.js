var express = require('express');
var router = express.Router();
var app = require('../app');

var mongoose = require('mongoose');
var Shop = mongoose.model('Shop');
var City = mongoose.model('City');
var Review = mongoose.model('Review');

var ngeohash = require('ngeohash');

/* Api starting point */
router.get('/', function(req, res) {
	res.json({ message: 'Welcome to the shops api' });
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
router.post('/shops', function(req, res, next) {

	var newShop = new Shop();
	saveNewShop(req.body, newShop);

	newShop.save(function(err, shop) {
		if (err) { return next(err); }

		/* We save the shop city if still not in the database */
		var newCity = new City({
			name: shop.city
		});

		newCity.save(function(err, city) {
			if (err) console.log("error: " + err);
		});	

		/* If the shop brings reviews, we save each */
		retrieveNewReviews(newShop, req.body);

		res.json(shop);
	});	
});

/* 
 * Saves a new shop given remote info
 */
function saveNewShop(shop_info, newShop) {

	var reviews = shop_info.reviews;
	var geohash = encodeCoords(shop_info.geometry.location);

	newShop.name = shop_info.name;
	newShop.description = shop_info.description;
	newShop.address = shop_info.formatted_address;
	newShop.phone_number = shop_info.international_phone_number;
	newShop.opening_hours = shop_info.opening_hours;
	newShop.website = shop_info.website;
	newShop.city = shop_info.city;
	newShop.geolocation = {
			geohash: geohash,
			location: shop_info.geometry.location
		};
	newShop.hidden = shop_info.permanently_closed;
	newShop.source = shop_info.source;
	newShop.source_id = shop_info.place_id ? shop_info.place_id : shop_info.source_id;
	newShop.rating = shop_info.rating ? shop_info.rating : 0;
	newShop.price_level = shop_info.price_level ? shop_info.price_level : 0;
	newShop.reviews_count = reviews ? reviews.length : 0;

	if(shop_info.photos && shop_info.photos.length > 0) 
		newShop.photos = shop_info.photos[0].photo_reference ? retrieveNewPhotos(shop_info.photos) : shop_info.photos;
	else 
		newShop.photos = [];
}

/* Get a shop detail by id, but not its reviews  */
router.get('/shops/:shop_id', function(req, res, next) {
	Shop.findById(
		req.params.shop_id,
		function (err, data) {
			if (err) { return next(err); }
			res.json(data);
	});	
});

/* Updates a shop details */
router.put('/shops/:shop_id', function(req, res, next) {
	Shop.findByIdAndUpdate(
		req.params.shop_id,
		{
			description: req.body.description
		},
		function (err, data) {
			if (err) {
				console.error(err);
				return next(err);
			}
			res.json(data);
	});	
});

/* Get all reviews  */
router.get('/reviews', function(req, res, next) {
	Review.find({
	}, function (err, data) {
		if (err) { return next(err); }
		res.json(data);
	});	
});

/* Get a list of a shop's reviews */
router.get('/shops/:shop_id/reviews', function(req, res, next) {
	Review.find({
		shop_id: req.params.shop_id 
	}, function (err, data) {
		if (err) { return next(err); }
		res.json(data);
	});
});

/* Check if a shop exists given its source id
 * (ie, Google Places ID)
 */
router.get('/shops/exists/:source_id', function(req, res, next) {
	Shop.find({
		source_id: req.params.source_id
	},
	function (err, data) {
		if (err) { return next(err); }
		res.json(data.length > 0);
	});
});

/* Remove a stored shop given its id */
router.delete('/shops/:shop_id', function(req, res, next) {
	if(req.params.shop_id === undefined) return console.error("No _id provided" ); 

	Shop.remove({
		_id: req.params.shop_id
	}, function (err, shopData) {
		if (err) return next(err);

		/* We remove all its reviews as well */
		Review.remove({
			shop_id: req.params.shop_id
		}, function (err, data) {
			if (err) return next(err);
			res.json(shopData);
		});
	});
});

/* Empty the DB, removes all shops, reviews and cities */
router.get('/removeall', function(req, res) {
	City.remove({}, function(err) { 
		Shop.remove({}, function(err) { 
			Review.remove({}, function(err) { 
				res.json({ message: 'All data removed' });
			});
		});
	});
});

/* Get a list of the available cities */
router.get('/cities', function(req, res, next) {
	City.find({}, function (err, data) {
		if (err) return next(err);
		res.json(data);
	});
});

/* Update data retrieved from google places */
router.get('/updateData', function(req, res, next) {
	Shop.find({}, function (err, data) {
		if (err) return next(err);
				
		data.forEach(function(shop) {
			locations.details({placeid: shop.source_id},
				function(err, details) {

				if(err) {
					console.log(err);
					return;
				}

				if(!details.result) {
					console.error("Error: ");
					console.error(details);
				} else {
					saveNewShop(details.result, shop);

					// We save new reviews
					retrieveNewReviews(shop, details.result);


					// We bring the new number of reviews
					var new_reviews_count = 0;

					Review.find({
						shop_id: shop._id 
					}, function (err, data) {
						if (err) return console.error(err);
						new_reviews_count = data.length;
						shop.reviews_count = new_reviews_count;
						shop.save();
					});	

				}
			});	
		});

		res.json({ message: 'All data updated' });
	});
});

/* 
 * Retrieves all reviews given the shop, and saves only the new ones.
 */
function retrieveNewReviews(shop, remote_shop) {
	var currShopReviews = [];

	if (remote_shop.reviews) {
	
		Review.find({
			shop_id: shop._id 
		}, function (err, data) {
			if (err) return console.error(err);
			currShopReviews = data;

			for (var i = 0; i < remote_shop.reviews.length; i++) {
				if (!reviewAlreadySaved(currShopReviews, remote_shop.reviews[i])) {

					var newReview = new Review({
						shop_id: shop._id,
						rating: remote_shop.reviews[i].rating,
						text: remote_shop.reviews[i].text,
						time: remote_shop.reviews[i].time
					});

					newReview.save(function(err, review) {
						if (err) {
							console.log("error:" + err);
						}
					});

				};
			};
		});

	};

}

/* 
 * Checks if a given remote review is already   
 * persisted as part of a shop, or not.
 */
function reviewAlreadySaved(reviews, new_review) {
	for (var i = 0; i < reviews.length; i++) {
		if(reviews[i].time == new_review.time) {
			return true;
		}
	};
	return false;
}

/* 
 * Given a remote array of photos, it retrieves the url  
 * for each and returns it in an array.
 */
function retrieveNewPhotos(remote_photos) {

	shopPhotosUrls = [];
	if (remote_photos) {
		for (var i = 0; i < remote_photos.length; i++) {
			locations.photo({
				photoreference: remote_photos[i].photo_reference, 
				maxwidth: 400
			}, function(err, photo) {
				if (err) console.log(err);
				shopPhotosUrls.push(photo);
			});
		};
	};

	return shopPhotosUrls;
}

/**
 * Finds the city of a given google place
 */
function getLocality(shop) {
	// TODO: this variable should be persisted and updated from the UI
	var CITY_COMPONENT = 'locality';
	var shopCity = '';

	if(shop.address_components) {
		shop.address_components.forEach(function(component) {
			component.types.forEach(function(componentType) {
				if(componentType == CITY_COMPONENT) {
					shopCity = component.long_name;
					return false;
				}
			});
			if(shopCity != '') return false;
		});
		return shopCity;
	}
}

/**
 * Encodes coordantes. Parameter should be a json
 * with lat and lng parameters.
 */
function encodeCoords(location) {
	return ngeohash.encode(location['lat'], location['lng']);
}

/* TODO: Remove all from here */
var GoogleLocations = require('google-locations');
var locations = new GoogleLocations('AIzaSyDDH78oK3DLTs9G1xfH798jO-5ok2FUvFQ');
// var GooglePlaces = require('google-places');
// var places = new GooglePlaces('AIzaSyDDH78oK3DLTs9G1xfH798jO-5ok2FUvFQ');
// var places = new GooglePlaces('AIzaSyCAPKkCs0gnsuZia_W_d7oZn8hx-xkJGW0');

module.exports = router;