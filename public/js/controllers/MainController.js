app.controller('MainController', [
	'$scope', 
	'$timeout', 
	'shopsService', 
	'libraryService',
	'$uibModal',
	'$location',
	'$localStorage',
	'AuthService',
	function($scope, $timeout, shopsService, libraryService, $uibModal, $location, $localStorage, AuthService) {

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

	/* Auth stuff */
	function successAuth(res) {
		$localStorage.token = res.token;
		window.location = "/";
	}

	$scope.login = function(loginForm) {
		AuthService.login(loginForm, successAuth, function () {
			// $rootScope.error = 'Invalid credentials.';
			console.log('Invalid credentials.');
		});
	};

	$scope.logout = function() {
		AuthService.logout(function () {
			console.log("Successfully logged out");
			window.location = "/login";
		});
	};

	$scope.token = $localStorage.token;
	$scope.tokenClaims = AuthService.getTokenClaims();
	/* End auth stuff */


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
	};

	$scope.updateShop = function(shopInfo) {
		return shopsService.update(shopInfo)
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