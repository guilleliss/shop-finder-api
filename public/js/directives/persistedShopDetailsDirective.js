app.directive('persistedShopDetails', [
	'$modal',
	function ($modal) {
	
	return {
		restrict: 'E',
		scope: {
			info: '=',
			deleteShop: '&'		
		},
		templateUrl: 'js/directives/persistedShopDetails.html',
		link: function ($scope, element, attrs) {

			$scope.info.photoUrl = $scope.info.photos[0];
			$scope.info.formatted_address = $scope.info.address;
			$scope.info.international_phone_number = $scope.info.phone_number;

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