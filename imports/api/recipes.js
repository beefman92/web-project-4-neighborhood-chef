import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import {Chefs} from "./chefs";
import { DEFAULT_SEARCH_RANGE} from "./constants";

const geoCoding = require("@mapbox/mapbox-sdk/services/geocoding");

export const Recipes = new Mongo.Collection("recipes");

if (Meteor.isServer) {
	Meteor.publish("chefRecipes", function(chefId) {
		return Recipes.find({chef_id: chefId});
	});
	Meteor.publish("recipe", function(recipeId) {
		return Recipes.find({_id: recipeId});
	});
	Meteor.publish("recipes", function(recipeIds) {
		return Recipes.find({_id: {$in: recipeIds}});
	});
}

Meteor.methods({
	"recipes.searchByName"(name) {
		const regex = ".*" + name + ".*";
		const recipeList = Recipes.find({name: {$regex: regex, $options: "i"}}).fetch();
		const groupedResult = {};
		recipeList.forEach((recipe) => {
			const chefId = recipe.chef_id;
			let recipes = groupedResult[chefId];
			if (recipes === undefined || recipes === null) {
				recipes = [];
				groupedResult[chefId] = recipes;
			}
			recipes.push(recipe);
		});
		return groupedResult;
	},
	"recipes.updateRecipes"(id, name, content, picture, price) {
		Recipes.update ({_id: id},
			{$set: {name: name, content: content, picture: picture, price: price}});
	},
	"recipes.insert"(name, content, picture, price) {
		check(name, String);
		check(content, String);
		check(picture, String);
		check(price, Number);
		if (Meteor.isServer) {
			if (!Meteor.userId()) {
				throw new Meteor.Error("not-authorized");
			}
			Recipes.insert({
				chef_id: Meteor.userId(),
				name: name,
				content: content,
				picture: picture,
				price: price,
			});
		}
	},
	"recipes.searchById"(recipeId) {
		check(recipeId, String);
		return Recipes.findOne({_id: recipeId});
	},
	"recipes.search"(recipeName, near) {
		check(recipeName, String);
		check(near, String);
		if (Meteor.isServer) {
			const geoCodingClient = geoCoding({accessToken: Meteor.settings.MAPBOX_API_TOKEN});
			return geoCodingClient.forwardGeocode({query: near, limit: 1}).send().then(response => {
				const body = response.body;

				const location = body.features[0].center;
				const latitude = location[1];
				const longitude = location[0];
				const minLatitude = latitude - DEFAULT_SEARCH_RANGE;
				const maxLatitude = latitude + DEFAULT_SEARCH_RANGE;
				const minLongitude = longitude - DEFAULT_SEARCH_RANGE;
				const maxLongitude = longitude + DEFAULT_SEARCH_RANGE;
				const chefs = Chefs.find(
					{$and: [
						{latitude: {$lt: maxLatitude}},
						{latitude: {$gt: minLatitude}},
						{longitude: {$lt: maxLongitude}},
						{longitude: {$gt: minLongitude}}]}).fetch();
				const chefMap = new Map();
				const chefIds = [];
				chefs.forEach((chef) => {
					chefMap.set(chef._id, chef);
					chefIds.push(chef._id);
				});
				const result = {
					latitude: latitude,
					longitude: longitude,
					searchResult: {},
				};
				const searchResult = result.searchResult;
				if (chefs.length > 0) {
					const regex = ".*" + recipeName + ".*";
					const recipeList = Recipes.find(
						{$and: [
							{name: {$regex: regex, $options: "i"}},
							{chef_id: {$in: chefIds}}]}).fetch();
					recipeList.forEach((recipe) => {
						const chefId = recipe.chef_id;
						let obj = searchResult[chefId];
						if (obj === undefined || obj === null) {
							obj = {
								chefInfo: chefMap.get(chefId),
								recipeList: [],
							};
							searchResult[chefId] = obj;
						}
						obj.recipeList.push(recipe);
					});
				}
				return result;
			});
		} else {
			return {};
		}
	}
});