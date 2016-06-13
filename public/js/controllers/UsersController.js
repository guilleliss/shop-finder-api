app.controller('UsersController', [
	'$scope', 
	'usersService', 
	'AlertService',
	function($scope, usersService, AlertService) {

	$scope.formCollapsed = true;
	$scope.newUser = {};
	
	$scope.newUserPanel = function(newUser) {
		$scope.formCollapsed = !$scope.formCollapsed;
	} 

	$scope.editUser = function(user) {
		$scope.formCollapsed = false;
		$scope.newUser = user;
	}	

	$scope.saveNewUser = function(newUser) {
		if(newUser.password != newUser.repeat) {
			console.log('wrong password');
		}
		usersService.create(newUser)
			.success(function(data) {
				$scope.getUsers();
				$scope.formCollapsed = true;
				$scope.newUser = {};
				$scope.alerts = AlertService.add("success", "User saved successfully.")
			})
			.error(function(err) {
				console.log(err);
			});
	}

	$scope.deleteUser = function(user) {
		usersService.delete(user)
			.success(function(data) {
				$scope.getUsers();
				$scope.alerts = AlertService.add("danger", "User deleted successfully.")
			})
			.error(function(err) {
				console.log(err);
			});
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