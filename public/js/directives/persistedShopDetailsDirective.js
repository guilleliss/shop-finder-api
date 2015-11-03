app.directive('persistedShopDetails', [
	'$uibModal',
	function ($uibModal) {
	
	return {
		restrict: 'E',
		scope: {
			info: '=',
			deleteShop: '&',
			updateShop: '&',
			getShopReviews: '&',
			launchShopDetailsModal: '&'
		},
		templateUrl: 'js/directives/persistedShopDetails.html',
		link: function ($scope, element, attrs) {

			$scope.info.photoUrl = $scope.info.photos[0];
			$scope.info.formatted_address = $scope.info.address;
			$scope.info.international_phone_number = $scope.info.phone_number;

			$scope.internalDeleteShop = function(shopId) {
				$scope.deleteShop({id: shopId});
			};

			$scope.getShopDetailsModal = function(shop) {
				$scope.launchShopDetailsModal({shopInfo: shop});
			};

		}
	};
}]);