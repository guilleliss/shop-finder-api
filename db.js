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
	hidden: { type: Boolean, default: 0 },
	source: String,
	source_id: { 
		type: String, 
		unique: true,
		dropDups: true
	},
	rating: { type: Number, default: 0 },
	price_level: { type: Number, default: 0 },
	reviews_count: { type: Number, default: 0 }
});

var Review = new Schema({
	rating: Number,
	time: Number,
	text: String,
	shop_id: { type: String, ref: 'Shop' }
});

var User = new Schema({
	username: String,
	password: String,
	email: String,
	gender: String
});

mongoose.model('Shop', Shop);
mongoose.model('Review', Review);

mongoose.connect(mongourl);