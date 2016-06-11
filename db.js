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

// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
	mongourl = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
	process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
	process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
	process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
	process.env.OPENSHIFT_APP_NAME;
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
	geohash: String,
	hidden: { type: Boolean, default: 0 },
	source: String,
	source_id: {
		type: String,
		unique: true,
		dropDups: true
	},
	rating: { type: Number, default: 0 },
	price_level: { type: Number, default: 0 },
	reviews_count: { type: Number, default: 0 },
	city: String
});

var Review = new Schema({
	rating: Number,
	time: Number,
	text: String,
	shop_id: { type: String, ref: 'Shop' }
});

var City = new Schema({
	name: {
		type: String,
		unique: true,
		dropDups: true
	}
});

var AppSettings = new Schema({
	settings: Object
});

var User = new Schema({
	name: {
		type: String,
		unique: true,
		dropDups: true
	},
	password: String,
	email: {
		type: String,
		unique: true,
		dropDups: true
	},
	admin: { type: Boolean, default: false }
});

mongoose.model('Shop', Shop);
mongoose.model('Review', Review);
mongoose.model('City', City);
mongoose.model('User', User);
mongoose.model('AppSettings', AppSettings);

mongoose.connect(mongourl);
