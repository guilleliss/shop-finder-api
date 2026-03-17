var mongourl = process.env.MONGODB_URI || 'mongodb://localhost/shop-finder';

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

mongoose.connect(mongourl);

mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});