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

			}, 200);

			$scope.internalSaveShop = function(shopInfo) {
				var shopToSave = {
					name: shopInfo.name,
					address: shopInfo.formatted_address,
					photos: [shopInfo.photoUrl],
					location: {
						lat: shopInfo.geometry.location.A,	
						lng: shopInfo.geometry.location.F,	
					},
					source: "Google",
					source_id: shopInfo.place_id
				};

				$scope.shopExists({ infoId: $scope.info.place_id })
					.then(function (response) {
						$scope.isInDatabase = response.data;
						if (!$scope.isInDatabase) {
							$scope.saveShop({shopToSave: shopToSave})
								.then(function(response){
									$scope.isInDatabase = true;
							});
						};
				});

			}

			$scope.getShopDetailsModal = function(shopInfo) {
				// var shopToShow = shopInfo;
				// $scope.getShopDetails({
				// 	sourceId: shopInfo.place_id
				// }).then(function(response) {
				// 	shopToShow = response;

				// 	var shopPhotos = [];
				// 	if (shopToShow.photos) {
				// 		for (var i = 0; i < shopToShow.photos.length; i++) {
				// 			shopPhotos.push(shopToShow.photos[i].getUrl({maxHeight: '400'})); 
				// 		};
				// 	};

				// 	shopToShow.shopPhotos = shopPhotos;


				// 	var modalInstance = $modal.open({
				// 		animation: true,
				// 		templateUrl: 'js/directives/shopDetailsModal.html',
				// 		controller: 'ModalInstanceCtrl',
				// 		scope: $scope,
				// 		backdrop: true,
				// 		// size: size,
				// 		resolve: {
				// 			shopInfo: function () {
				// 	  			return shopToShow;
				// 			}
				// 		}
				// 	});

				// 	modalInstance.result.then(function () {
				// 	}, function () {
				// 		console.log('modal dismissed');
				// 		// $log.info('Modal dismissed at: ' + new Date());
				// 	});

			// });

			};

		}
	};
}]);

app.directive('persistedShopDetails', [
	'$timeout',
	function ($timeout) {
	
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

			}, 200);

			$scope.internalDeleteShop = function(shopId) {
				$scope.deleteShop({id: shopId});
			}
		}
	};
}]);