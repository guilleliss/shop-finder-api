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
					// if(data == null) data = {};
					// $scope.appSettings = JSON.stringify(data.settings, null, 4);;
					$scope.obj = {data: data.settings, options: { mode: 'tree' , expanded: true}};
				})
				.error(function(err) {
					console.log(err);
				});
		};

		$scope.saveAppSettings = function(appSettings) {
			let settingsJson = appSettings;
			// let settingsJson = eval("(" + appSettings + ")");
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
			$scope.obj.options.mode = $scope.obj.options.mode == 'code' ? 'tree' : 'code' ; //should switch you to code view
		}

		$scope.getAppSettings();

}]);