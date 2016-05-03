var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:3000/api');

var token = '';

describe('Settings', function () {
	before(function(done) {
		api.post('/authenticate')
		.set('Accept', 'application/json')
		.send({
			name: 'tappas',
			password: 'j3/nTB5(s?=+h6zv',
		})
		.expect('Content-type', /json/)
		.expect(200)
		.end(function(err, res) {
			token = res.body.token;
			done();
		});
	});

	it('should return a 200 and settings object', function (done) {
		api.get('/settings/')
		.set({'Accept': 'application/json', 'x-access-token': token})
		.expect(200)
		.end(function(err, res) {
			expect(res.body).to.be.an('object');
			expect(res.body).to.have.property('settings')
				.that.is.an('object');
			// expect(res.body).to.have.property('updated')
			// 	.that.is.a('number');
			// expect(res.body).to.have.property('config')
			// 	.that.is.a('object');
			// expect(res.body).to.have.property('style')
			// 	.that.is.a('object');
			// expect(res.body).to.have.property('share')
			// 	.that.is.a('object');
			// expect(res.body).to.have.property('table')
			// 	.that.is.a('object');
			done();
		});
	});

});