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