var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:3000/api');

var test_user;
var token = '';

describe('User', function () {
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

	after(function(done) {
		done();
	});

	it('should return _id when user is saved successfully', function (done) {
		api.post('/users')
		.set({'Accept': 'application/json', 'x-access-token': token})
		.send({
			name: 'UserTest',
			password: 'UserTest',
			email: 'test@email.com',
			admin: false
		})
		.expect('Content-type', /json/)
		.expect(200)
		.end(function(err, res) {
			expect(res.body).to.be.an('object');			
			expect(res.body).to.have.property('_id')
				.that.is.a('string');
			test_user = res.body;
			done();
		});
	});

	it('should return error when saving duplicated username', function (done) {
		api.post('/users')
		.set({'Accept': 'application/json', 'x-access-token': token})
		.send({
			name: 'UserTest',
			password: 'randompass',
			email: 'randomtest@email.com',
			admin: false
		})
		.expect('Content-type', /json/)
		.expect(200)
		.end(function(err, res) {
			expect(res.body).to.be.an('object');		
			expect(res.body).to.have.property('status')
				.to.equal(500);
			done();
		});
	});

	it('should return error when saving duplicated email', function (done) {
		api.post('/users')
		.set({'Accept': 'application/json', 'x-access-token': token})
		.send({
			name: 'anotherUserName',
			password: 'randompass',
			email: 'test@email.com',
			admin: false
		})
		.expect('Content-type', /json/)
		.expect(200)
		.end(function(err, res) {
			expect(res.body).to.be.an('object');		
			expect(res.body).to.have.property('status')
				.to.equal(500);
			done();
		});
	});

	it('should return details of the user with values', function (done) {
		api.get('/users/'+ test_user._id + '/')
		.set({'Accept': 'application/json', 'x-access-token': token})	
		.expect(200)
		.end(function(err, res) {
			expect(res.body).to.be.an('object');
			expect(res.body).to.have.property('name')
				.that.is.a('string');
			expect(res.body).to.have.property('password')
				.that.is.a('string');
			expect(res.body).to.have.property('email')
				.that.is.a('string');
			expect(res.body).to.have.property('admin')
				.that.is.a('boolean');
			done();
		});
	});

	it('should return error when user not found', function (done) {
		api.get('/users/'+ 'random_user_id' + '/')
		.set({'Accept': 'application/json', 'x-access-token': token})	
		.expect(500)
		.end(function(err, res) {
			expect(res.body).to.be.an('object');
			expect(res.body).to.have.property('status')
				.to.equal(500);			
			done();
		});
	});

	it('should return list of all users', function (done) {
		api.get('/users/')
		.set({'Accept': 'application/json', 'x-access-token': token})	
		.expect(200)
		.end(function(err, res) {
			expect(res.body).to.be.an('array')
			.to.have.length.above(0);
			done();
		});
	});

	it('should return ok when remove existing user', function (done) {
		api.delete('/users/'+ test_user._id + '/')
		.set({'Accept': 'application/json', 'x-access-token': token})
		.expect('Content-type', /json/)
		.expect(200)
		.end(function(err, res) {
			expect(res.body).to.be.an('object');
			expect(res.body).to.have.property('ok')
			.that.is.a('number')
			.to.equal(1);
			expect(res.body).to.have.property('n')
			.that.is.a('number')
			.to.equal(1);
			done();
		});	
	});

	it('should return 0 objects removed when removing non existing user', function (done) {
		api.delete('/users/'+ test_user._id + '/')
		.set({'Accept': 'application/json', 'x-access-token': token})
		.expect('Content-type', /json/)
		.expect(200)
		.end(function(err, res) {
			expect(res.body).to.be.an('object');
			expect(res.body).to.have.property('n')
			.that.is.a('number')
			.to.equal(0);
			done();
		});	
	});
})