app.controller('ModalInstanceController', [
	'$scope',
	'$modalInstance',
	'shopInfo',
	'shopsService',
	function ($scope, $modalInstance, shopInfo, shopsService) {

	$scope.shopInfo = shopInfo;

	$scope.ok = function () {
		$modalInstance.close();
	};

	$scope.saveDescription = function () {
		shopsService.update(shopInfo);		
	};

	$scope.slides = shopInfo.shopPhotos;
}]);