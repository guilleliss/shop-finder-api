var app = angular.module('shopApp', [
	'ngRoute',
	'ngGPlaces',
	'ngAnimate',
	'ui.bootstrap']);

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
		otherwise({
			redirectTo: '/'
		});

	$locationProvider.html5Mode(true);
});