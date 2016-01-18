app.controller('AuthController', [
	'$scope',
	'$location',
	'$localStorage',
	'AuthService',
	function($scope, $location, $localStorage, AuthService) {

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

}]);