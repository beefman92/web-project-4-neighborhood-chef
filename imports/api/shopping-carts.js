import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

import { Recipes } from "./recipes";
import { Orders } from "./orders";

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
				const currentRecord = ShoppingCarts.findOne({user_id: Meteor.userId(), recipe_id: recipeId});
				if (currentRecord !== undefined && currentRecord !== null) {
					ShoppingCarts.update({user_id: Meteor.userId(), recipe_id: recipeId}, {$inc: {count: 1}});
				} else {
					ShoppingCarts.insert({
						user_id: Meteor.userId(),
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
	"shopping.checkout"() {
		if (!Meteor.userId()) {
			throw new Meteor.Error("not-authorized");
		}

		if (Meteor.isServer) {
			const items = ShoppingCarts.find({user_id: Meteor.userId()}).fetch();
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
			// groups items in shopping carts by chef_id
			const groupedItems = {};
			for (let i = 0; i < items.length; i++) {
				let array = groupedItems[items[i].chef_id];
				if (array === undefined || array === null) {
					array = [];
					groupedItems[items[i].chef_id] = array;
				}
				array.push(items[i]);
			}
			const keys = Object.keys(groupedItems);
			if (keys.length > 1) {
				// create one parent order and some children orders in table orders
				const parentOrder = {};
				parentOrder.type = 1;
				parentOrder.parent = null;
				parentOrder.children = [];
				parentOrder.create_time = checkoutTime;
				parentOrder.customer_id = Meteor.userId();
				const parentId = Orders.insert(parentOrder);
				const childOrderIds = [];

				for (let i = 0; i < keys.length; i++) {
					const key = keys[i];
					const array = groupedItems[key];
					const childOrder = {};
					childOrder.type = 2;
					childOrder.parent = parentId;
					childOrder.children = null;
					childOrder.create_time = checkoutTime;
					childOrder.status = "new";
					childOrder.chef_id = array[0].chef_id;
					childOrder.customer_id = Meteor.userId();
					childOrder.recipes = array.map(value => {
						return {
							recipe_id: value.recipe_id,
							price: value.unit_price * value.count,
							count: value.count,
						};
					});
					const childId = Orders.insert(childOrder);
					childOrderIds.push(childId);
				}

				Orders.update({_id: parentId}, {$set: {children: childOrderIds}});
			} else {
				// create one entry in table order
				const newOrder = {};
				newOrder.type = 0;
				newOrder.parent = null;
				newOrder.children = null;
				newOrder.create_time = checkoutTime;
				newOrder.status = "new";
				newOrder.chef_id = items[0].chef_id;
				newOrder.customer_id = Meteor.userId();
				newOrder.recipes = items.map(value => {
					return {
						recipe_id: value.recipe_id,
						price: value.unit_price * value.count,
						count: value.count,
					};
				});
				Orders.insert(newOrder);
			}
		}
	}
});