var app = angular.module('shopApp', [
	'ngRoute',
	'ngGPlaces',
	'angular-loading-bar',
	'ngAnimate',
	'ui.bootstrap',
	'ngStorage'
]);

app.config(['$routeProvider', 
	'$locationProvider', 
	'$httpProvider', 
	function ($routeProvider, $locationProvider, $httpProvider) {
	$routeProvider.
		when('/', {
			templateUrl: 'partials/shopsView',
			controller: 'ShopsController'
		}).
		when('/googleplaces', {
			templateUrl: 'partials/gpView',
			controller: 'GPController'
		}).
		when('/apicheck', {
			templateUrl: 'partials/apiCheckView',
			controller: 'ApiCheckController'
		}).
		when('/login', {
			templateUrl: 'partials/login',
			controller: 'AuthController'
		}).
		otherwise({
			redirectTo: '/'
		});

	$locationProvider.html5Mode(true);
	
	$httpProvider.interceptors.push(['$q', 
		'$location', 
		'$localStorage', 
		function ($q, $location, $localStorage) {
		return {
			'request': function (config) {
				config.headers = config.headers || {};
				if ($localStorage.token) {
					config.headers['x-access-token'] = $localStorage.token;
				}
				return config;
			},
			'responseError': function (response) {
				if (response.status === 401 || response.status === 403) {
					$location.path('/login');
				}
				return $q.reject(response);
			}
		};
	}]);
}]);
