app.directive('shopDetails', [
	'$modal',
	function ($modal) {
	
	return {
		restrict: 'E',
		scope: {
			info: '=',
			saveShop: '&',
			shopExists: '&',
			getShopDetails: '&'
		},
		templateUrl: 'js/directives/shopDetailsDirective.html',
		link: function ($scope, element, attrs) {

			$scope.isInDatabase = false;
			var dataWasRetrieved = false;

			/* Check if the shop already exists in database */
			$scope.shopExists({ infoId: $scope.info.place_id })
				.then(function (response) {
					$scope.isInDatabase = response.data;
			});

			/* Get the full version of the shop only if we haven't before */
			$scope.internalGetShopDetails = function() {
				if (dataWasRetrieved) {
					return new Promise(
						function(resolve, reject) {
							resolve("data already retrieved");
						});
				};
				return new Promise(
					function(resolve, reject) {

						$scope.getShopDetails({
							sourceId: $scope.info.place_id
						}).then(function(response) {
							$scope.info = response;

							shopPhotosUrls = [];
							if ($scope.info.photos) {
								for (var i = 0; i < $scope.info.photos.length; i++) {
									shopPhotosUrls.push($scope.info.photos[i].getUrl({'maxWidth': 400, 'maxHeight': 400}));
								};
							};

							$scope.info.photos = shopPhotosUrls;

							dataWasRetrieved = true;
							resolve("done");
						});

					});
			}


			
			/* Bring shop details if not yet, and saves them to API */
			$scope.internalSaveShop = function(shopInfo) {
				
				$scope.shopExists({ infoId: $scope.info.place_id })
					.then(function (response) {
						$scope.isInDatabase = response.data;
						if (!$scope.isInDatabase) {
							$scope.internalGetShopDetails().then(function(data) {

								var shopToShow = $scope.info;

								/* Set default fields */
								var opening_hours = {};
								if(shopToShow.opening_hours) {
									opening_hours = { 
											periods: shopToShow.opening_hours.periods,
											weekday_text: shopToShow.opening_hours.weekday_text
										};
								}

								/* Prepare data for API */
								var shopToSave = {
									name: shopToShow.name,
									address: shopToShow.formatted_address,
									phone_number: shopToShow.international_phone_number,
									opening_hours: opening_hours,
									photos: shopToShow.photos,
									geolocation: {
										lat: shopToShow.geometry.location.G,	
										lng: shopToShow.geometry.location.K,	
									},
									source: "Google",
									source_id: shopToShow.place_id,
									rating: shopToShow.rating ? shopToShow.rating : 0,
									price_level: shopToShow.price_level ? shopToShow.price_level : 0,
									website: shopToShow.website,
									reviews: shopToShow.reviews
								};

								/* Save the data */
								$scope.saveShop({shopToSave: shopToSave})
									.then(function(response){
										$scope.isInDatabase = true;
								});

							});

						};
				});
			};

			$scope.getShopDetailsModal = function(shopInfo) {
				$scope.internalGetShopDetails().then(function(data) {
					var shopToShow = $scope.info;

					var modalInstance = $modal.open({
						animation: true,
						templateUrl: 'js/directives/shopDetailsModal.html',
						controller: 'ModalInstanceController',
						scope: $scope,
						backdrop: true,
						// size: size,
						resolve: {
							shopInfo: function () {
					  			return shopToShow;
							}
						}
					});

					modalInstance.result.then(function () {
					}, function () {
						console.log('modal dismissed');
					});
				});

			};

		}
	};
}]);