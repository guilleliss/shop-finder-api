var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');
var api = supertest('http://localhost:3000/api');

var shop1;
var token = '';

describe('Shop', function () {
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
			api.post('/shops')
			.set({'Accept': 'application/json', 'x-access-token': token})
			.send({
				name: 'Test name',
				formatted_address: 'Test address',
				international_phone_number: '00012341243',
				opening_hours: {
					weekday_text: [
						"monday 0 to 12",
						"tuesday 0 to 12",
						"wednesday 0 to 12",
						"thursday 0 to 12",
						"friday 0 to 12",
						"saturday 0 to 12",
						"sunday closed"
					]
				},
				photos: ['http://urlphoto1.com', 'http://urlphoto1.com'],
				geometry: {
					location: {				
						lat: 0,
						lng: 0,
					},
					geohash: 'testhash'
				},
				source: "Google",
				source_id: 'Test source id',
				rating: 3,
				price_level: 3.5,
				website: 'www.testwebsite.com',
				reviews: [
					{
						"rating": 4,
						"text": "test review 1",
						"time": 1348790400
					},
					{
						"rating": 5,
						"text": "test review 2",
						"time": 1433514218
					}
				]
			})
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				shop1 = res.body;
				done();
			});
		});
	});

	after(function(done) {
		api.delete('/shops/'+shop1._id + '/')
		.set({'Accept': 'application/json', 'x-access-token': token})
		.expect('Content-type', /json/)
		.expect(200)
		.end(function(err, res) {
			done();
		});
	});

	it('list should return a 200 response', function (done) {
		api.get('/shops')
		.set({'Accept': 'application/json', 'x-access-token': token})
		.expect(200, done);
	});

	it('should return a list of shops', function (done) {
		api.get('/shops')
		.set({'Accept': 'application/json', 'x-access-token': token})
		.expect(200)
		.end(function(err, res) {
			expect(res.body).to.be.an('array');
			expect(res.body).to.have.length.above(1);
			done();
		});
	});

	it('should return shop details with key values', function (done) {
		api.get('/shops/' + shop1._id + '/')
		.set({'Accept': 'application/json', 'x-access-token': token})
		.expect(200)
		.end(function(err, res) {
			expect(res.body).to.be.an('object');
			expect(res.body).to.have.property('name')
				.that.is.a('string');
			expect(res.body).to.have.property('address')
				.that.is.a('string');
			expect(res.body).to.have.property('phone_number')
				.that.is.a('string');
			expect(res.body).to.have.property('opening_hours')
				.that.is.an('object')
				.to.include.keys('weekday_text');
			expect(res.body).to.have.property('photos')
				.that.is.an('array');
			expect(res.body).to.have.property('geolocation')
				.that.is.an('object')
				.to.include.keys('geohash')
				.to.include.keys('location');
			expect(res.body).to.have.property('source')
				.that.is.a('string');
			expect(res.body).to.have.property('source_id')
				.that.is.a('string');
			expect(res.body).to.have.property('rating')
				.that.is.a('number');
			expect(res.body).to.have.property('price_level')
				.that.is.a('number');
			expect(res.body).to.have.property('website')
				.that.is.a('string');
			expect(res.body).to.have.property('reviews_count')
				.that.is.a('number');
			expect(res.body).to.have.property('reviews_count')
				.to.equal(2);
			done();
		});
	});

	it('should return shop details with two photo urls', function (done) {
		api.get('/shops/' + shop1._id + '/')
		.set({'Accept': 'application/json', 'x-access-token': token})
		.expect(200)
		.end(function(err, res) {
			expect(res.body).to.have.property('photos')
				.that.is.an('array')
				.to.have.length(2);
			done();
		});
	});

	it('should return list of two shop reviews', function (done) {
		api.get('/shops/' + shop1._id + '/reviews/')
		.set({'Accept': 'application/json', 'x-access-token': token})	
		.expect(200)
		.end(function(err, res) {
			expect(res.body).to.be.an('array');
			expect(res.body).to.have.length(2);
			done();
		});
	});
})