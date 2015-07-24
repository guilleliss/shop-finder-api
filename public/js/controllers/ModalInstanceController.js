app.controller('ModalInstanceController', [
	'$scope',
	'$modalInstance',
	'shopInfo',
	function ($scope, $modalInstance, shopInfo) {

	$scope.shopInfo = shopInfo;

	$scope.ok = function () {
		$modalInstance.close();
	};

	$scope.slides = shopInfo.shopPhotos;
}]);