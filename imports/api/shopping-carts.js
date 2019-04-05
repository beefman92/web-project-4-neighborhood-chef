import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

import { Recipes } from "./recipes";

export const ShoppingCarts = new Mongo.Collection("shopping-carts");

if (Meteor.isServer) {
	Meteor.publish("userShoppingCarts", function () {
		return ShoppingCarts.find({user_id: Meteor.userId()});
	});
}

Meteor.methods({
	"shoppingCarts.addNewOne"(recipeId) {
		check(recipeId, String);
		if (Meteor.isServer) {
			if (!Meteor.userId()) {
				throw new Meteor.Error("not-authorized");
			}
			const recipe = Recipes.findOne({_id: recipeId});
			if (recipe !== undefined && recipe !== null) {
				ShoppingCarts.insert({
					user_id: Meteor.userId(),
					recipe_id: recipeId,
					name: recipe.name,
					time: new Date(),
					unit_price: recipe.price,
					count: 1,
				});
			} else {
				throw new Meteor.Error("Cannot find recipe " + recipeId);
			}
		}
	},
	"shoppingCarts.minusOne"(recipeId) {
		check(recipeId, String);
		if (Meteor.isServer) {
			if (!Meteor.userId()) {
				throw new Meteor.Error("not-authorized");
			}
			const recipe = Recipes.findOne({_id: recipeId});
			if (recipe !== undefined && recipe !== null) {
				ShoppingCarts.update({user_id: Meteor.user(), recipe_id: recipeId}, {$inc: {count: -1}});
				ShoppingCarts.remove({user_id: Meteor.user(), recipe_id: recipeId, count: {$lte: 0}});
			} else {
				ShoppingCarts.remove({user_id: Meteor.user(), recipe_id: recipeId});
			}
		}
	},
	"shoppingCarts.plusOne"(recipeId) {
		check(recipeId, String);
		if (Meteor.isServer) {
			if (!Meteor.userId()) {
				throw new Meteor.Error("not-authorized");
			}
			const recipe = Recipes.findOne({_id: recipeId});
			if (recipe !== undefined && recipe !== null) {
				ShoppingCarts.update({user_id: Meteor.user(), recipe_id: recipeId}, {$inc: {count: 1}});
			} else {
				ShoppingCarts.remove({user_id: Meteor.user(), recipe_id: recipeId});
			}
		}
	}
});