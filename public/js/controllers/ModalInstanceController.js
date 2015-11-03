app.controller('ModalInstanceController', [
	'$scope',
	'$uibModalInstance',
	'shopInfo',
	'shopsService',
	function ($scope, $uibModalInstance, shopInfo, shopsService) {

	$scope.shopInfo = shopInfo;

	$scope.ok = function () {
		$uibModalInstance.close();
	};

	$scope.saveDescription = function () {
		return shopsService.update(shopInfo)
			.success(function(data) {
				$scope.addAlert("info", "Shop updated successfully.")
				// $scope.updateShops();
			})
			.error(function(err) {
				console.log(err);
			});
	};

	$scope.slides = shopInfo.shopPhotos;
}]);