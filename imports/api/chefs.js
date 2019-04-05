import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Chefs = new Mongo.Collection("chefs");

const geoCoding = require("@mapbox/mapbox-sdk/services/geocoding");

if (Meteor.isServer) {
	Meteor.publish("chefInfo", function(chefId) {
		return Chefs.find({_id: chefId});
	});

}

Meteor.methods({
	"chefs.insertOrUpdate"() {
		if (Meteor.isServer) {
			if (!Meteor.userId()) {
				throw new Meteor.Error("not-authorized");
			}
			const chefInfo = {};
			chefInfo.name = Meteor.user().username;
			chefInfo.address = Meteor.user().profile.address;
			chefInfo.phone = Meteor.user().profile.phone;
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
						phone: chefInfo.phone}, function() {
						Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.is_chef": true}});
					});
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
		return Chefs.find(
			{$and: [
				{latitude: {$lt: maxLatitude}},
				{latitude: {$gt: minLatitude}},
				{longitude: {$lt: maxLongitude}},
				{longitude: {$gt: minLongitude}}]}).fetch();
	},
	"chefs.searchByName"(name) {
		check(name, String);
		const regexp = ".*" + name + ".*";
		return Chefs.find({name: {$regex: regexp, $options: "i"}}).fetch();
	},
	"chefs.getByIds"(ids) {
		check(ids, Array);
		return Chefs.find({_id: {$in: ids}}).fetch();
	},
	"token.getMapToken"() {
		if (Meteor.isServer) {
			const token = Meteor.settings.MAPBOX_API_TOKEN;
			return token;
		}
	}
});