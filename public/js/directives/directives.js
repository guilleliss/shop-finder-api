app.directive('shopDetails', [
	'$timeout',
	'$modal',
	function ($timeout, $modal) {
	
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

			$scope.shopExists({ infoId: $scope.info.place_id })
				.then(function (response) {
					$scope.isInDatabase = response.data;
			});

			$timeout(function() {
				var imgTag = angular.element(element[0].querySelector('.shop-photo img'))[0];
				var containerTag = angular.element(element[0].querySelector('.shop-photo'))[0];
				
				var imgHeight = imgTag.offsetHeight;
				var imgWidth = imgTag.offsetWidth;
				var conHeight = containerTag.offsetHeight;
				var conWidth = containerTag.offsetWidth;
				
				$scope.imgStyle = {};
				
				if(imgHeight > 0 && imgWidth > 0) {
					if(imgHeight == imgWidth) {
						$scope.imgStyle = {
								height: conHeight + 'px',
								width: conWidth + 'px',
							};
						
					} else if(imgHeight > imgWidth) {
						var gap = (imgHeight/imgWidth*conWidth - conHeight)/2;
						$scope.imgStyle = {
								'margin-top': -gap + 'px',
								width: conWidth + 'px',
							};
					} else if(imgHeight < imgWidth) {
						var gap = (conHeight/imgHeight*imgWidth - conWidth)/2;
						$scope.imgStyle = {
								'margin-left': -gap + 'px',
								height: conHeight + 'px',
							};
					}
				}

			}, 400);

			$scope.internalSaveShop = function(shopInfo) {
				$scope.shopExists({ infoId: $scope.info.place_id })
					.then(function (response) {
						$scope.isInDatabase = response.data;
						if (!$scope.isInDatabase) {
							$scope.getShopDetails({
								sourceId: shopInfo.place_id
							}).then(function(response) {
								shopToShow = response;

								var shopPhotos = [];
								if (shopToShow.photos) {
									for (var i = 0; i < shopToShow.photos.length; i++) {
										shopPhotos.push(shopToShow.photos[i].getUrl({maxHeight: '500'})); 
									};
								};

								opening_hours = {};
								if(shopToShow.opening_hours) {
									opening_hours = { 
											periods: shopToShow.opening_hours.periods,
											weekday_text: shopToShow.opening_hours.weekday_text
										};
								}

								var shopToSave = {
									name: shopToShow.name,
									address: shopToShow.formatted_address,
									phone_number: shopToShow.international_phone_number,
									opening_hours: opening_hours,
									photos: shopPhotos,
									geolocation: {
										lat: shopToShow.geometry.location.A,	
										lng: shopToShow.geometry.location.F,	
									},
									source: "Google",
									source_id: shopToShow.place_id,
									rating: shopToShow.rating,
									price_level: shopToShow.price_level,
									website: shopToShow.website
								};

								$scope.saveShop({shopToSave: shopToSave})
									.then(function(response){
										$scope.isInDatabase = true;
								});

							});
						};
				});
			};

			$scope.getShopDetailsModal = function(shopInfo) {
				var shopToShow = shopInfo;
				$scope.getShopDetails({
					sourceId: shopInfo.place_id
				}).then(function(response) {
					shopToShow = response;

					var shopPhotos = [];
					if (shopToShow.photos) {
						for (var i = 0; i < shopToShow.photos.length; i++) {
							shopPhotos.push(shopToShow.photos[i].getUrl({maxHeight: '400'})); 
						};
					};

					shopToShow.photos = shopPhotos;

					var modalInstance = $modal.open({
						animation: true,
						templateUrl: 'js/directives/shopDetailsModal.html',
						controller: 'ModalInstanceCtrl',
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
						// $log.info('Modal dismissed at: ' + new Date());
					});
				});
			};

		}
	};
}]);

app.directive('persistedShopDetails', [
	'$timeout',
	'$modal',
	function ($timeout, $modal) {
	
	return {
		restrict: 'E',
		scope: {
			info: '=',
			deleteShop: '&'		
		},
		templateUrl: 'js/directives/persistedShopDetails.html',
		link: function ($scope, element, attrs) {
			$timeout(function() {
				var imgTag = angular.element(element[0].querySelector('.shop-photo img'))[0];
				var containerTag = angular.element(element[0].querySelector('.shop-photo'))[0];
				
				var imgHeight = imgTag.offsetHeight;
				var imgWidth = imgTag.offsetWidth;
				var conHeight = containerTag.offsetHeight;
				var conWidth = containerTag.offsetWidth;
				
				$scope.imgStyle = {};
				
				if(imgHeight > 0 && imgWidth > 0) {
					if(imgHeight == imgWidth) {
						$scope.imgStyle = {
								height: conHeight + 'px',
								width: conWidth + 'px',
							};
						
					} else if(imgHeight > imgWidth) {
						var gap = (imgHeight/imgWidth*conWidth - conHeight)/2;
						$scope.imgStyle = {
								'margin-top': -gap + 'px',
								width: conWidth + 'px',
							};
					} else if(imgHeight < imgWidth) {
						var gap = (conHeight/imgHeight*imgWidth - conWidth)/2;
						$scope.imgStyle = {
								'margin-left': -gap + 'px',
								height: conHeight + 'px',
							};
					}
				}

			}, 400);

			$scope.internalDeleteShop = function(shopId) {
				$scope.deleteShop({id: shopId});
			};

			$scope.getShopDetailsModal = function(shopInfo) {
				var shopToShow = shopInfo;
				var modalInstance = $modal.open({
					animation: true,
					templateUrl: 'js/directives/shopDetailsModal.html',
					controller: 'ModalInstanceCtrl',
					scope: $scope,
					backdrop: true,
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
			};

		}
	};
}]);