router.get('/populate/:keyword', function(req, res) {
	places.search({keyword: req.params.keyword, location: [40.414142,-3.703738], radius: 600}, function(err, response) {
		if(err) { console.log(err); return; }
		
		for (i = 0; i < response.results.length; i++) { 

				places.details({placeid: response.results[i].place_id}, function(err, detailsResponse) {
					if(err) { console.log(err); return; }

					var localResult = detailsResponse.result;

					var shopPhotos = [];
					if(localResult.photos) {
						
						// places.details({placeid: response.results[i].place_id}, function(err, response) {
						// 	if(err) { console.log(err); return; }

						// 	for (j = 0; j < response.result.photos.length; j++) { 
						// 		places.photo({photoreference: response.result.photos[j].photo_reference, maxwidth: 400}, function(err, response) {
						// 			if(err) { console.log(err); return; }
						// 			shopPhotos.push(response);
						// 		});
						// 	}
						// });

						shopPhotos.push(buildPhotoUrl(localResult.photos[0].photo_reference, 400));
					}

					var newShop = new Shop({
						name: localResult.name,
						address: localResult.formatted_address,
						phone_number: localResult.international_phone_number,
						geolocation: localResult.geometry.location,
						hidden: false,
						source: "Google",
						source_id: localResult.place_id,
						photos: shopPhotos
					});

					console.log(newShop);
				});

			// newShop.save(function(err, shop) {
			// 	if (err) res.send(err);
			// 	console.log(shop);
			// });	
		}


		res.json(response.results);
	});
});