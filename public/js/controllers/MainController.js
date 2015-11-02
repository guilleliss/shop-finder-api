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

	$scope.updateShop = function(shopId) {
		return shopsService.update(shopId)
			.success(function(data) {
				$scope.addAlert("info", "Shop updated successfully.")
				$scope.updateShops();
			})
			.error(function(err) {
				console.log(err);
			});
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

	$scope.getShopReviews = function(shopId) {
		return shopsService.getShopReviews(shopId)
			.success(function(data) {
				return data;
			})
			.error(function(err) {
				console.log(err);
			});
	};

	/* Initiates the dashboward data*/
	$scope.updateShops();
}]);