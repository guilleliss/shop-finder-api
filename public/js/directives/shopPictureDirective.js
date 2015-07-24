app.directive('shopPictureDirective', [
	'$timeout',
	function ($timeout) {
	
	return {
		restrict: 'E',
		scope: {
			srcphoto: '=',
		},
		templateUrl: 'js/directives/shopPictureDirective.html',
		link: function ($scope, element, attrs) {

			/* Crop picture to biggest centered square */
			$timeout(function() {
				var imgTag = angular.element(element[0].querySelector('.shop-photo img'))[0];
				var containerTag = angular.element(element[0].querySelector('.shop-photo'))[0];
				
				var imgHeight = imgTag.offsetHeight;
				var imgWidth = imgTag.offsetWidth;
				var conHeight = containerTag.offsetHeight;
				var conWidth = containerTag.offsetWidth;
				
				$scope.imgStyle = {};
				
				if(imgHeight > 0 && imgWidth > 0) {
					if(imgHeight == imgWidth) {
						$scope.imgStyle = {
								height: conHeight + 'px',
								width: conWidth + 'px',
							};
						
					} else if(imgHeight > imgWidth) {
						var gap = (imgHeight/imgWidth*conWidth - conHeight)/2;
						$scope.imgStyle = {
								'margin-top': -gap + 'px',
								width: conWidth + 'px',
							};
					} else if(imgHeight < imgWidth) {
						var gap = (conHeight/imgHeight*imgWidth - conWidth)/2;
						$scope.imgStyle = {
								'margin-left': -gap + 'px',
								height: conHeight + 'px',
							};
					}
				}

			}, 400);	

		}
	};
}]);