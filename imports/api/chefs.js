import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Chefs = new Mongo.Collection("chefs");

//Meteor.settings.MAPBOX_API_TOKEN
const geoCoding = require("@mapbox/mapbox-sdk/services/geocoding");

if (Meteor.isServer) {
	Meteor.publish("chefInfo", function(chefId) {
		return Chefs.find({_id: chefId});
	});
}

Meteor.methods({
	"chefs.insertOrUpdate"(chefInfo) {
		if (Meteor.isServer) {
			if (!Meteor.userId()) {
				throw new Meteor.Error("not-authorized");
			}
			check(chefInfo.name, String);
			check(chefInfo.address, String);
			check(chefInfo.phone, String);
			const geoCodingClient = geoCoding({accessToken: Meteor.settings.MAPBOX_API_TOKEN});
			geoCodingClient.forwardGeocode({query: chefInfo.address, limit: 2}).send().then(response => {
				const body = response.body;
				const accurateAdd = body.features[0].place_name;
				const location = body.features[0].center;
				chefInfo.address = accurateAdd;
				if (chefInfo._id === undefined || chefInfo._id === null || chefInfo._id === "") {
					// create new restaurant
					Chefs.insert({
						_id: Meteor.userId(),
						name: chefInfo.name,
						address: chefInfo.address,
						latitude: location[1],
						longitude: location[0],
						phone: chefInfo.phone});
				} else {
					// update restaurant info
					// TODO: check if this user has already had a restaurant.
					Chefs.update({_id: chefInfo._id},
						{$set: {address: chefInfo.address, latitude: location[1], longitude: location[0], phone: chefInfo.phone}});
				}
			});
		}
	},
	"chefs.getNearbyChefs"(latitude, longitude) {
		const minLatitude = latitude - 0.01;
		const maxLatitude = latitude + 0.01;
		const minLongitude = longitude - 0.02;
		const maxLongitude = longitude + 0.02;
		console.log("latitude: " + latitude + ", longitude: " + longitude);
		console.log("minLatitude: " + minLatitude + ", maxLatitude: " + maxLatitude);
		console.log("minLongitude: " + minLongitude + ", maxLongitude: " + maxLongitude);
		return Chefs.find(
			{$and: [
				{latitude: {$lt: maxLatitude}},
				{latitude: {$gt: minLatitude}},
				{longitude: {$lt: maxLongitude}},
				{longitude: {$gt: minLongitude}}]}).fetch();
	},
	"chefs.getChefsByName"(id) {
		check(id, String);

	}
})