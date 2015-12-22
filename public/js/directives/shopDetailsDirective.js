app.directive('shopDetails', [
	'$uibModal',
	function ($uibModal) {
	
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

			$scope.googlePlacesList = true;

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

							$scope.info.city = getLocality($scope.info);

							$scope.info.photos = shopPhotosUrls;

							dataWasRetrieved = true;
							resolve("done");
						});

					});
			}

			/* Finds the city of a Google Places detail */
			function getLocality(shop) {
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
									formatted_address: shopToShow.formatted_address,
									international_phone_number: shopToShow.international_phone_number,
									opening_hours: opening_hours,
									photos: shopToShow.photos,
									city: shopToShow.city,
									geometry: {
										location: {
											lat: shopToShow.geometry.location.lat(),
											lng: shopToShow.geometry.location.lng()
										}
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

					var modalInstance = $uibModal.open({
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