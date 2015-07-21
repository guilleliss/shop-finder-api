app.factory('GPService', [
	'ngGPlacesAPI', 
	'shopsService', 
	'$q', 
	function(ngGPlacesAPI, shopsService, $q) {

	this.getShops = function(gprequest) {
		// var searchService = new google.maps.places.PlacesService(document.querySelector('#map'));
		
		// var res = {};
		// searchService.nearbySearch(gprequest, function(data){
		// 	console.log(data);
		// 	res = data;	
			// for (var i = 0; i < 10; i++) {
			// 	var detailsReq = { placeId: data[i].place_id };
			// 	searchService.getDetails(detailsReq, function(details) {
			// 		console.log(details.name);
			// 	});
			// };
		// });

		console.log(gprequest);

		return ngGPlacesAPI.textSearch({
			"location": gprequest.location, 
			"query": gprequest.keyword,
			"radius": gprequest.radius
		}).then(function(data) {
			for (var i = 0; i < data.length; i++) {

				/* Add photo url to the result */
				if(data[i].photos != undefined &&
					data[i].photos.length > 0) {
					data[i].photoUrl = data[i].photos[0].getUrl({maxHeight: '400'});
				}

				/* Check if the store is already in database */
				// data[i].inDatabase = false;
				// shopsService.exists(data[i].place_id)
				// 	.success(function(shopExists) {
				// 		if(shopExists) {
				// 			console.log(i);
				// 			data[i].inDatabase = true;
				// 		}
				// 	})
				// 	.error(function(err) {
				// 		console.log(err);
				// 	});
				// console.log(data[i].inDatabase);
			};

			return data;
		});

		// var promises = [];
		// var locationDetails = [];

		// ngGPlacesAPI.radarSearch({
		// 	"location": gprequest.location, 
		// 	"keyword": gprequest.keyword,
		// 	"radius": gprequest.radius
		// }).then(function(data) {
		// 	// for (var i = 0; i < 20; i++) {
		// 	 angular.forEach(data, function(result) {
		// 	 	promises.push(ngGPlacesAPI.placeDetails({'placeId': result.place_id}).then(function(details) {
		// 			// console.log(details.name);
		// 			locationDetails.push(details);
		// 			// return details;
		// 		}));	
		// 		// promises.push(deferred.promise); 

		// 	});
		// });

		// console.log(promises);

		// return $q.all(promises).then(function() {
		// 	// console.log(locationDetails);
		// 	return locationDetails;
		// });
	};

	this.getShopDetails = function(sourceId) {
		return ngGPlacesAPI.placeDetails({'placeId': sourceId})
		.then(function(details) {
				return details;
			});
	};


	return {
		getShops: this.getShops,
		getShopDetails: this.getShopDetails,
	}

}]);