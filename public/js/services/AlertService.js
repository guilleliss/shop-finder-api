app.factory('AlertService', [ 
	'$timeout',
	function ($timeout) {
			alerts = [];

			this.close = function(index) {
				$scope.alerts.splice(index, 1);
			};

			this.add = function(type, msg) {
				var newAlert = {type: type, msg: msg};
				var newLength = alerts.push(newAlert);
				$timeout(function() {
					alerts.splice(alerts.indexOf(newAlert), 1);
				}, 3000);
				return alerts;
			};

			this.get = function() {
				return alerts;
			}

			this.clear = function() {
				alerts = [];
			}

			return {
				get: this.get,
				add: this.add,
				close: this.close,
				clear: this.clear
			};
		}
	]);