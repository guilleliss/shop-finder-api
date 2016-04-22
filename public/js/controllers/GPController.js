app.controller('GPController', [
	'$scope',
	'ngGPlacesAPI', 
	'GPService', 
	'shopsService',
	'AlertService',
	function($scope, ngGPlacesAPI, GPService, shopsService, AlertService) {

	var location = {
		lat: 40.414142,
		lon: -3.703738 
	};

	var gprequest = {
		location: location,
		radius: '1000',
		keyword: 'tapas in madrid',
		latitude: 40.414142,
		longitude: -3.703738
	};

	GPService.getShops(gprequest).then(function(data) {
		$scope.gpShops = data;
	});

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

	$scope.updateShops = function() {
		shopsService.get()
			.success(function(data) {
				$scope.shops = data;
			})
			.error(function(err) {
				console.log(err);
			});
	}

	$scope.saveShop = function(shopToSave) {
		return shopsService.create(shopToSave)
			.success(function(savedData) {
				console.log("Data saved!");
				$scope.alerts = AlertService.add('success','Shop saved!');
				$scope.updateShops();
				return true;
			})
			.error(function(err) {
				console.log(err);
			});
	};

	// $scope.gpShops = GPService.getShops(gprequest);
	// console.log($scope.gpShops);

	$scope.search = function(searchData) {
		console.log(searchData);
		if(searchData != undefined) {
			var gprequest = {
				location: location,
				radius: '1000',
				keyword: searchData.keyword
			};

			GPService.getShops(gprequest).then(function(data) {
				$scope.alerts = AlertService.add('success', data.length + ' shops found');
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