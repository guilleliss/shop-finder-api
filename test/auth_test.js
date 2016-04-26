var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:3000/api');

var token = '';

describe('Auth', function () {
	
	it('should return a 403 without authentication', function (done) {
		api.get('/shops')
		.expect(403, done);
	});

	it('should return a 200 and no token with user not found', function (done) {
		api.post('/authenticate')
		.set('Accept', 'application/json')
		.send({
			name: 'fakeuser',
			password: 'wrongpassword',
		})
		.expect('Content-type', /json/)
		.expect(200)
		.end(function(err, res) {
			expect(res.body).to.not.have.property('token');
			expect(res.body).to.have.property('success').that.is.false;
			expect(res.body).to.have.property('message').that.equals('Authentication failed. User not found.');
			done();
		});
	});

	it('should return a 200 and no token with a wrong password', function (done) {
		api.post('/authenticate')
		.set('Accept', 'application/json')
		.send({
			name: 'tappas',
			password: 'wrongpassword',
		})
		.expect('Content-type', /json/)
		.expect(200)
		.end(function(err, res) {
			expect(res.body).to.not.have.property('token');
			expect(res.body).to.have.property('success').that.is.false;
			expect(res.body).to.have.property('message').that.equals('Authentication failed. Wrong password.');
			done();
		});
	});

	it('should return a 200 and token with correct user and password', function (done) {
		api.post('/authenticate')
		.set('Accept', 'application/json')
		.send({
			name: 'tappas',
			password: 'j3/nTB5(s?=+h6zv',
		})
		.expect('Content-type', /json/)
		.expect(200)
		.end(function(err, res) {
			expect(res.body).to.have.property('token');
			expect(res.body).to.have.property('success').that.is.true;
			done();
		});
	});


});