app.controller('UsersController', [
	'$scope', 
	'usersService', 
	function($scope, usersService) {
	
	$scope.newUserPanel = function() {
		console.log('new user');
	} 

	$scope.getUsers = function() {
		usersService.get()
			.success(function(data) {
				$scope.users = data;
			})
			.error(function(err) {
				console.log(err);
			});
	}

	$scope.getUsers();
	
}]);