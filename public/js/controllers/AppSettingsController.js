app.controller('AppSettingsController', [
	'$scope', 
	'appSettingsService',
	'AlertService',
	function($scope, appSettingsService, AlertService) {

		$scope.obj = {data: {}, options: { mode: 'tree' }};

		$scope.getAppSettings = function() {
			appSettingsService.get()
				.success(function(data) {
					console.log(data);
					$scope.obj = {data: data, options: { mode: 'tree' , expanded: true}};
				})
				.error(function(err) {
					console.log(err);
				});
		};

		$scope.saveAppSettings = function(appSettings) {
			let settingsJson = appSettings;
			appSettingsService.save(settingsJson)
				.success(function(data) {
					console.log(data);
					$scope.alerts = AlertService.add("success", "Settings updated successfully.")
					$scope.getAppSettings();
				})
				.error(function(err) {
					console.log(err);
					$scope.alerts = AlertService.add("danger", "Something happened, settings not updated.")
				});
		};

		$scope.changeMode = function() {
			$scope.obj.options.mode = $scope.obj.options.mode == 'code' ? 'tree' : 'code' ;
		}

		$scope.getAppSettings();

}]);