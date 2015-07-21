app.controller('MainController', [
	'$scope', 
	'$timeout', 
	'shopsService', 
	'libraryService',
	function($scope, $timeout, shopsService, libraryService) {

	/* Alerts should be managed in a separate controller/service */
	$scope.alerts = [];

	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};

	$scope.addAlert = function(type, msg) {
		var newAlert = {type: type, msg: msg};
		var newLength = $scope.alerts.push(newAlert);
		$timeout(function() {
			$scope.alerts.splice($scope.alerts.indexOf(newAlert), 1);
		}, 3000);
	}
	/* End alerts */

	$scope.callSetImgSize = libraryService.setImgSize;

	$scope.formData = {};

	/* Set data functions using the service */
	$scope.updateShops = function() {
		shopsService.get()
			.success(function(data) {
				$scope.shops = data;
			})
			.error(function(err) {
				console.log(err);
			});
	}		

	$scope.createShop = function() {

		if (!$.isEmptyObject($scope.formData)) {
			shopsService.create($scope.formData)
				.success(function(data) {
					// $scope.shops = data;
					$scope.formData = {};
				})
				.error(function(err) {
					console.log(err);
				});
		}

	};


	$scope.saveShop = function(shopToSave) {

		return shopsService.create(shopToSave)
			.success(function(savedData) {
				console.log("Data saved!");
				$scope.addAlert('success','Shop saved!');
				$scope.updateShops();
				return true;
			})
			.error(function(err) {
				console.log(err);
			});

		// // if (!$.isEmptyObject(shopToSave)) {
		// 	return shopsService.exists(shopToSave.source_id)
		// 		.success(function(shopIsInDatabase) {
		// 			if(!shopIsInDatabase) {
		// 			} else {
		// 				console.log("Shop already in database");
		// 				$scope.addAlert('warning', 'Data alread in database.');
		// 				return true;
		// 			}
		// 		})
		// 		.error(function(err) {
		// 			console.log(err);
		// 		});
		// // }

	};

	$scope.deleteShop = function(shopId) {
		
		return shopsService.delete(shopId)
			.success(function(data) {
				$scope.addAlert("danger", "Shop deleted successfully.")
				$scope.updateShops();
			})
			.error(function(err) {
				console.log(err);
			});
	};

	$scope.shopExists = function(shopId) {
		return shopsService.exists(shopId)
			.success(function(shopIsInDatabase) {
				return shopIsInDatabase;
			})
			.error(function(err) {
				console.log(err);
				return false;
			});
	}

	/* Initiates the dashboward data*/
	$scope.updateShops();
}]);

app.controller('ShopsController', [
	'$scope', 
	'shopsService',
	function($scope, shopsService) {
}]);

app.controller('GPController', [
	'$scope',
	'ngGPlacesAPI', 
	'GPService', 
	'shopsService',
	function($scope, ngGPlacesAPI, GPService, shopsService, libraryService) {

	var location = {
			lat: 40.414142,
			lng: -3.703738 
	};

	var gprequest = {
		location: location,
		radius: '1000',
		keyword: 'tapas in madrid'
	};

	// $scope.gpShops = GPService.getShops(gprequest);

	GPService.getShops(gprequest).then(function(data) {
		$scope.gpShops = data;
	});

	$scope.search = function(searchData) {
		console.log(searchData);
		if(searchData != undefined) {
			var gprequest = {
				location: location,
				radius: '1000',
				keyword: searchData.keyword
			};

			GPService.getShops(gprequest).then(function(data) {
				$scope.addAlert('success', data.length + ' shops found');
				$scope.gpShops = data;
			});			
		}
	}

	$scope.getShopDetails = function(sourceId) {
		return GPService.getShopDetails(sourceId)
		.then(function(response) {
			return response;
		});
	}

}]);

app.controller('ApiCheckController', [
	'$scope', 
	'shopsService',
	function($scope, shopsService) {

		$scope.getShopsApi = function() {
			shopsService.get()
				.success(function(data) {
					$scope.apiShops = data;
				})
				.error(function(err) {
					console.log(err);
				});
		};

		$scope.getShopByIdApi = function(shopId) {
			var localId = '55845adcf0df04fc06000015';
			if (shopId != undefined) {
				localId = shopId;
			};
			shopsService.getById(localId)
				.success(function(data) {
					$scope.apiShop = data;
				})
				.error(function(err) {
					console.log(err);
				});
		};

		$scope.shopExistsApi = function(shopId) {
			var localId = '55845adcf0df04fc06000015';
			if (shopId != undefined) {
				localId = shopId;
			};

			shopsService.exists(localId)
				.success(function(data) {
					$scope.existsApi = data;
				})
				.error(function(err) {
					console.log(err);
				});
		};

}]);

app.controller('ModalInstanceCtrl', [
	'$scope',
	'$modalInstance',
	'shopInfo',
	function ($scope, $modalInstance, shopInfo) {

	$scope.shopInfo = shopInfo;

	$scope.ok = function () {
		$modalInstance.close();
	};

	$scope.slides = shopInfo.shopPhotos;
}]);