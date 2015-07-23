app.factory('GPService', [
	'ngGPlacesAPI', 
	'shopsService', 
	'$q', 
	function(ngGPlacesAPI, shopsService, $q) {

	var searchService = new google.maps.places.PlacesService(document.querySelector('#map'));

	this.getShops = function(gprequest) {
		
		// var res = {};
		// return searchService.radarSearch(gprequest, function(data, status) {
		// 	if (status != google.maps.places.PlacesServiceStatus.OK) {
		// 		console.log(status);
		// 		return;
		// 	}
		// 	// console.log(data);
		// 	res = data;	

		// 	return data;
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
			};

			return data;
		});
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