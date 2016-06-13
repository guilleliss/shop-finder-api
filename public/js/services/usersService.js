app.factory('usersService', ['$http', function($http) {
	
	this.getUsers = function() {
		return $http.get('/api/users/')
			.success(function(data) {
				return data;
			})
			.error(function(err) {
				console.log(err);
				return err;
			});
	};

	this.getUserById = function(id) {
		return $http.get('/api/users/' + id)
			.success(function(data) {
				return data;
			})
			.error(function(err) {
				console.log(err);
				return err;
			});
	};

	this.createUser = function(formData) {
		console.log(formData);
		return $http.post('/api/users/', formData)
			.success(function(data) {
				return data;
			})
			.error(function(err) {
				console.log(err);
				return err;
			});
	};

	// this.updateUser = function(userInfo) {
	// 	return $http.put('/api/users/' + userInfo._id, userInfo)
	// 		.success(function(data) {
	// 			return data;
	// 		})
	// 		.error(function(err) {
	// 			console.log(err);
	// 			return err;
	// 		});
	// };

	this.deleteUser = function(user) {
		return $http.delete('/api/users/' + user._id)
			.success(function(data) {
				return data;
			})
			.error(function(err) {
				console.log(err);
				return err;
			});
	};

	return {
		get: this.getUsers,
		getById: this.UserById,
		create: this.createUser,
		delete: this.deleteUser
	}

}]);