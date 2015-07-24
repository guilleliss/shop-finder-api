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

	GPService.getShops(gprequest).then(function(data) {
		$scope.gpShops = data;
	});

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