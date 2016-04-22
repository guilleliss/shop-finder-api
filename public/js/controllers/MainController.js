app.controller('MainController', [
	'$scope', 
	'$timeout', 
	'shopsService', 
	'libraryService',
	'$uibModal',
	'AuthService',
	'AlertService',
	function($scope, $timeout, shopsService, libraryService, 
		$uibModal, AuthService, AlertService) {

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

	$scope.updateShop = function(shopInfo) {
		return shopsService.update(shopInfo)
			.success(function(data) {
				$scope.alerts = AlertService.add("info", "Shop updated successfully.")
				$scope.updateShops();
			})
			.error(function(err) {
				console.log(err);
			});
	};

	$scope.deleteShop = function(shopId) {
		return shopsService.delete(shopId)
			.success(function(data) {
				$scope.alerts = AlertService.add("danger", "Shop deleted successfully.")
				$scope.updateShops();
			})
			.error(function(err) {
				console.log(err);
			});
	};

	$scope.getShopReviews = function(shopId) {
		return shopsService.getShopReviews(shopId)
			.success(function(data) {
				return data;
			})
			.error(function(err) {
				console.log(err);
			});
	};

	$scope.launchShopDetailsModal = function(shopInfo) {
		var shopToShow = shopInfo;

		$scope.getShopReviews(shopToShow._id)
			.then(function (response) {
				shopToShow.reviews = response.data;
			});

		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'js/directives/shopDetailsModal.html',
			controller: 'ModalInstanceController',
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

	/* Initiates the dashboward data*/
	$scope.updateShops();
}]);