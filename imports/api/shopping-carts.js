import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

import { Recipes } from "./recipes";
import { Orders } from "./orders";
import { NEW, COMMENT_DISABLE } from "./order-status";

export const ShoppingCarts = new Mongo.Collection("shopping_carts");

if (Meteor.isServer) {
	Meteor.publish("userShoppingCarts", function (chefId) {
		return ShoppingCarts.find({user_id: Meteor.userId(), chef_id: chefId});
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
				const currentRecord = ShoppingCarts.findOne({user_id: Meteor.userId(), recipe_id: recipeId});
				if (currentRecord !== undefined && currentRecord !== null) {
					ShoppingCarts.update({user_id: Meteor.userId(), recipe_id: recipeId}, {$inc: {count: 1}});
				} else {
					ShoppingCarts.insert({
						user_id: Meteor.userId(),
						chef_id: recipe.chef_id,
						recipe_id: recipeId,
						name: recipe.name,
						time: new Date(),
						unit_price: recipe.price,
						count: 1,
					});
				}
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
				ShoppingCarts.update({user_id: Meteor.userId(), recipe_id: recipeId}, {$inc: {count: -1}});
				ShoppingCarts.remove({user_id: Meteor.userId(), recipe_id: recipeId, count: {$lte: 0}});
			} else {
				ShoppingCarts.remove({user_id: Meteor.userId(), recipe_id: recipeId});
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
				ShoppingCarts.update({user_id: Meteor.userId(), recipe_id: recipeId}, {$inc: {count: 1}});
			} else {
				ShoppingCarts.remove({user_id: Meteor.userId(), recipe_id: recipeId});
			}
		}
	},
	"shopping.checkout"(chefId) {
		check(chefId, String);
		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		if (Meteor.isServer) {
			const items = ShoppingCarts.find({user_id: Meteor.userId(), chef_id: chefId}).fetch();
			const recipeIds = [];
			for (let i = 0; i < items.length; i++) {
				recipeIds.push(items[i].recipe_id);
			}
			const recipes = Recipes.find({_id: {$in: recipeIds}}).fetch();
			const recipesObject = {};
			for (let i = 0; i < recipes.length; i++) {
				const recipe = recipes[i];
				recipesObject[recipe._id] = recipes[i];
			}

			const checkoutTime = new Date();

			// create one entry in table order
			const newOrder = {};
			newOrder.create_time = checkoutTime;
			newOrder.status = NEW;
			newOrder.chef_id = items[0].chef_id;
			newOrder.customer_id = Meteor.userId();
			newOrder.recipes = items.map(value => {
				return {
					recipe_id: value.recipe_id,
					price: recipesObject[value.recipe_id].price * value.count,
					count: value.count,
				};
			});
			newOrder.comment_status = COMMENT_DISABLE;
			const id = Orders.insert(newOrder);

			// remove these entries in shopping_cart
			const itemIds = [];
			for (let i = 0; i < items.length; i++) {
				itemIds.push(items[i]._id);
			}
			ShoppingCarts.remove({_id: {$in: itemIds}});
			return id;
		}
	}
});