var mongourl = 'mongodb://localhost/shop-finder';

if(process.env.VCAP_SERVICES){
	var env = JSON.parse(process.env.VCAP_SERVICES);
	var mongo = env['mongodb-1.8'][0]['credentials'];

	var generate_mongo_url = function(obj) {
		obj.hostname = (obj.hostname || 'localhost');
		obj.port = (obj.port || 27017);
		obj.db = (obj.db || 'test');
		if(obj.username && obj.password){
			return "mongodb://" + obj.username + ":" + obj.password + "@" + obj.hostname + ":" + obj.port + "/" + obj.db;
		}
		else {
			return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
		}
	}
	mongourl = generate_mongo_url(mongo);
}

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Shop = new Schema({
	name:  String,
	description: String,
	address: String,
	phone_number: String,
	opening_hours: Object,
	website: String,
	photos: Array,
	geolocation: Object,
	hidden: Boolean,
	source: String,
	source_id: { 
		type: String, 
		unique: true,
		dropDups: true
	},
	rating: Number,
	price_level: Number
});

var User = new Schema({
	username: String,
	password: String,
	email: String,
	gender: String
});

mongoose.model('Shop', Shop);

mongoose.connect(mongourl);