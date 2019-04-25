import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Chefs = new Mongo.Collection("chefs");

const geoCoding = require("@mapbox/mapbox-sdk/services/geocoding");

if (Meteor.isServer) {
	Meteor.publish("chefInfo", function(chefId) {
		return Chefs.find({_id: chefId});
	});
	Meteor.publish("chefInfos", function(chefIds) {
		return Chefs.find({_id: {$in: chefIds}});
	});
}

function buildAddress(addressObject) {
	return addressObject.address + ", " + addressObject.city + ", " + addressObject.province
		+ " " + addressObject.postcode + ", " + addressObject.country;
}

function buildAddress2(address, city, province, postcode, country) {
	return address + ", " + city + ", " + province + " " + postcode + ", " + country;
}

Meteor.methods({
	"chefs.insert"(chefInfo) {
		if (Meteor.isServer) {
			if (!Meteor.userId()) {
				throw new Meteor.Error("not-authorized");
			}
			check(chefInfo, Object);
			check(chefInfo.name, String);
			check(chefInfo.description, String);
			check(chefInfo.optionAddress, Object);
			check(chefInfo.phone, String);
			const address = buildAddress(chefInfo.optionAddress);
			const geoCodingClient = geoCoding({accessToken: Meteor.settings.MAPBOX_API_TOKEN});
			geoCodingClient.forwardGeocode({query: address, limit: 2}).send().then(response => {
				const body = response.body;
				const accurateAdd = body.features[0].place_name;
				const location = body.features[0].center;
				chefInfo.formal_address = accurateAdd;
				Chefs.insert({
					_id: Meteor.userId(),
					name: chefInfo.name,
					description: chefInfo.description,
					picture: chefInfo.picture,
					formal_address: chefInfo.formal_address,
					address: chefInfo.optionAddress.address,
					city: chefInfo.optionAddress.city,
					postcode: chefInfo.optionAddress.postcode,
					province: chefInfo.optionAddress.province,
					country: chefInfo.optionAddress.country,
					latitude: location[1],
					longitude: location[0],
					phone: chefInfo.phone}, function() {
					Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.is_chef": true}});
				});
			});
		}
	},
	"chef.update"(chefInfo) {
		if (Meteor.isServer) {
			if (!Meteor.userId()) {
				throw new Meteor.Error("not-authorized");
			}
			check(chefInfo, Object);

			const geoCodingClient = geoCoding({accessToken: Meteor.settings.MAPBOX_API_TOKEN});
			const completeAddress = buildAddress2(
				chefInfo.address,
				chefInfo.city,
				chefInfo.postcode,
				chefInfo.province,
				chefInfo.country);
			geoCodingClient.forwardGeocode({query: completeAddress, limit: 2}).send().then(response => {
				const body = response.body;
				const location = body.features[0].center;
				chefInfo.latitude = location[1];
				chefInfo.longitude = location[0];
				Chefs.update({_id: Meteor.userId()}, {$set: chefInfo});
			});
		}
	},
	"chefs.getAddress"(latitude, longitude) {
		check(latitude, Number);
		check(longitude, Number);
		if (Meteor.isServer) {
			const geoCodingClient = geoCoding({accessToken: Meteor.settings.MAPBOX_API_TOKEN});
			return geoCodingClient.reverseGeocode({
				query: [longitude, latitude],
				types: ["address"],
			}).send().then(response => {
				const match = response.body;
				return match;
			}).catch(error => {
				return error;
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

	// let chef edit their own personal information
	"chefs.updateInfo"(address, phone) {
		Chefs.update ({_id: Meteor.userId()},
			{$set: {address: address, phone: phone}});
	},
	"token.getMapToken"() {
		if (Meteor.isServer) {
			const token = Meteor.settings.MAPBOX_API_TOKEN;
			return token;
		}
	},
	"chef.getNearChefByGeo"(latitude, longitude) {
		check(latitude, Number);
		check(longitude, Number);
		if (Meteor.isServer) {
			const geoCodingClient = geoCoding({accessToken: Meteor.settings.MAPBOX_API_TOKEN});
			return geoCodingClient.reverseGeocode({
				query: [longitude, latitude],
				types: ["place"],
			}).send().then(response => {
				const match = response.body;
				if (match.features.length > 0) {
					const city = match.features[0].text;
					// TODO: what if two cities have same name?

					const minLatitude = latitude - 0.3;
					const maxLatitude = latitude + 0.3;
					const minLongitude = longitude - 0.3;
					const maxLongitude = longitude + 0.3;
					const regexp = ".*" + city + ".*";
					const chefs = Chefs.find(
						{$and: [
							{city: {$regex: regexp, $options: "i"}},
							{latitude: {$lt: maxLatitude}},
							{latitude: {$gt: minLatitude}},
							{longitude: {$lt: maxLongitude}},
							{longitude: {$gt: minLongitude}}]}).fetch();
					return {
						city: city,
						chefs: chefs,
					};
				}
				return null;
			}).catch(error => {
				return error;
			});
		}
	},
	"chef.getNearChefByAddress"(address) {

	}
});