var app = angular.module('shopApp', [
	'ngRoute',
	'ngGPlaces',
	'ngAnimate',
	'angular-loading-bar',
	'ui.bootstrap'
]);

app.config(function ($routeProvider, $locationProvider) {
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
			controller: 'MainController'
		}).		
		otherwise({
			redirectTo: '/'
		});

	$locationProvider.html5Mode(true);
});