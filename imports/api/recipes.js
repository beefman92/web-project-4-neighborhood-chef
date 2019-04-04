import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Recipes = new Mongo.Collection("recipes");

if (Meteor.isServer) {
	Meteor.publish("chefRecipes", function(chefId) {
		return Recipes.find({chef_id: chefId});
	});
	Meteor.publish("recipe", function(recipeId) {
		return Recipes.find({_id: recipeId});
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
			recipes.push(recipes);
		});
		return groupedResult;
	}
})