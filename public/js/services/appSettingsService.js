app.factory('appSettingsService', [
	'$http',
	function($http) {

		this.get = function() {
			return $http.get('/api/settings/')
				.success(function(data) {
					return data;
				})
				.error(function(err) {
					console.log(err);
					return err;
				});
		}

		this.save = function(settingsData) {
			return $http.post('/api/settings/', settingsData)
				.success(function(data) {
					return data;
				})
				.error(function(err) {
					console.log(err);
					return err;
				});
		}		

		return {
			get: this.get,
			save: this.save
		};
	 }]);