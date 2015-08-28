app.factory('shopsService', ['$http', function($http) {

	ss = this;

	this.getShops = function() {
		return $http.get('/api/shops/')
			.success(function(data) {
				return data;
			})
			.error(function(err) {
				console.log(err);
				return err;
			});
	};

	this.getShopById = function(id) {
		return $http.get('/api/shops/' + id)
			.success(function(data) {
				return data;
			})
			.error(function(err) {
				console.log(err);
				return err;
			});
	};

	this.createShop = function(formData) {
		return $http.post('/api/shops/', formData)
			.success(function(data) {
				return data;
			})
			.error(function(err) {
				console.log(err);
				return err;
			});
	};

	this.deleteShop = function(id) {
		return $http.delete('/api/shops/' + id)
			.success(function(data) {
				return data;
			})
			.error(function(err) {
				console.log(err);
				return err;
			});
	};

	this.shopExists = function(sourceId) {
		return $http.get('/api/shops/exists/' + sourceId)
			.success(function(data) {
				return data;
			})
			.error(function(err) {
				console.log(err);
				return err;
			});
	};

	this.getShopReviews = function(id) {
		return $http.get('/api/shops/'+id+'/reviews/')
			.success(function(data) {
				return data;
			})
			.error(function(err) {
				console.log(err);
				return err;
			});
	};

	return {
		get: this.getShops,
		getById: this.getShopById,
		create: this.createShop,
		delete: this.deleteShop,
		exists: this.shopExists,
		getShopReviews: this.getShopReviews,
	}

}]);