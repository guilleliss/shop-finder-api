var express = require('express');
var router = express.Router();
var app = require('../app');

var mongoose = require('mongoose');

/* Get settings for the client app */
router.get('/', function(req, res) {
	// TODO: This information should be persisted and updated from the UI
	
	var settingsJson = {
		title: "App Settings",
		updated : "2016-04-21T18:25:43-05:00",
		config:{
			aboutLink: "http://gettappas.com/",
			faqLink: "http://gettappas.com/",
			privacyLink: "http://gettappas.com/",
			appMenuBackgroundImageLink: "http://www.barkalastudios.com/wp-content/uploads/bg.jpg"
		},
		style:{
			navBarTintColor: "#f7947d", 
			navBarButtonItemTintColor:"#ffffff",
			navBarTitleColor: "#ffffff",
			navBarTitleSize : 30
		},
		share: {
			appShareImageLink: "http://www.picturescolourlibrary.co.uk/loreswithlogo/1917011.jpg",
			appShareMessage: "Tappas, la aplicación mas copada del universo. Comparte con amigos y perros!",
			appShareLink: "http://barkalastudios.com"
		},
		table: {
			backgroundColor: "#FFFFFF",
			sections: [{
				name: "SUPPORT", 
				data: [
					{ 
						title : "Help and Feedback",
						icon: { class: 1, type: 11, color : "#FFCC00"},
						action : { type: "link", data:"http://barkalastudios.com"}
					},
					{
						title : "Email Us",
						icon: { class: 1, type: 13, color : "#006699"},
						action : { type: "dlink", data : { dlink:"mailto:hello@gettappas.com?subject=Greetings%20from%20Cupertino!&body=Wish%20you%20were%20here!"}}

					},
					{   
						title : "Add Features",
						icon: { class: 1, type: 3, color : "#2CA390"},
						action : { type: "mail", data : { to:"hello@gettappas.com", subject:"Email Us", body:"html body"}}
					} 
				]},
				{	
					name: "SOCIAL",
					data: [
						{
							title : "Rate this App",
							icon: { class: 1, type: 4, color : "#E60073"},
							action : { type:"dlink", data :{dlink:"http://itunes.apple.com/app/id378458261",
							   link:"http://itunes.apple.com/app/id378458261", appName:"App Store"}}
						},
						{
							title : "Follow Us on Twitter",
							icon: { class: 1, type: 150, color : "#4099FF"},
							action : { type:"dlink", data:{ dlink:"twitter:///user?screen_name=spiritsciences",link:"https://twitter.com/spiritsciences", appName:"Twitter"}}
						},
						{
							title : "Like Us on Facebook",
							icon: { class: 1, type: 100, color : "#3B5998"},
							action : { type:"dlink", data:{ dlink:"fb://profile/113810631976867", link:"https://www.facebook.com/thespiritscience", appName:"Facebook"}}
						},
						{
							title : "Terms of Service",
							icon: { class: 1, type: 197, color : "#006600"},
							action : { type:"link", data:"http://barkalastudios.com"}
						},
						{
							title : "Privacy Policy",
							icon: { class: 1, type: 5, color : "#cc3300"},
							action : { type:"link", data:"http://barkalastudios.com"}
						}
				]}
			]}
	};

	res.json(settingsJson);
});

module.exports = router;