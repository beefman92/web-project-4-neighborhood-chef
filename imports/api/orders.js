import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import { NEW, ACCEPTED, READY, PICKED_UP, FINISHED, CANCELED, CANCELING } from "./order-status";
import { RecipeComments, RecipeCount } from "./recipe-comments";

export const Orders = new Mongo.Collection("orders");

if (Meteor.isServer) {
	Meteor.publish("customerOpenOrders", function() {
		return Orders.find({customer_id: Meteor.userId(), status: {$in: [NEW, ACCEPTED, READY, PICKED_UP]}},
			{sort: {create_time: -1}});
	});
	Meteor.publish("customerCompletedOrders", function() {
		return Orders.find({customer_id: Meteor.userId(), status: {$in: [FINISHED, CANCELED]}},
			{sort: {create_time: -1}});
	});
	Meteor.publish("customerAllOrders", function() {
		return Orders.find({customer_id: Meteor.userId()},
			{sort: {create_time: -1}});
	});
	Meteor.publish("chefOpenOrders", function() {
		return Orders.find({chef_id: Meteor.userId(), status: {$in: [NEW, ACCEPTED, READY, PICKED_UP]}},
			{sort: {create_time: -1}});
	});
	Meteor.publish("chefCompletedOrders", function() {
		return Orders.find({chef_id: Meteor.userId(), status: {$in: [FINISHED, CANCELED]}},
			{sort: {create_time: -1}});
	});
	Meteor.publish("chefAllOrders", function() {
		return Orders.find({chef_id: Meteor.userId()},
			{sort: {create_time: -1}});
	});
}

Meteor.methods({
	"orders.customerCancel"(orderId) {
		if (Meteor.isServer) {
			check(orderId, String);
			if (!Meteor.userId()) {
				throw new Meteor.Error("not-authorized");
			}
			Orders.update({_id: orderId, customer_id: Meteor.userId()}, {$set: {status: CANCELING}});
		}
	},
	"orders.customerConfirm"(orderId) {
		if (Meteor.isServer) {
			check(orderId, String);
			if (!Meteor.userId()) {
				throw new Meteor.Error("not-authorized");
			}
			const endTime = new Date();
			const orderObject = Orders.findOne({_id: orderId});
			const tempCommentObject = {
				create_time: endTime,
				order_id: orderObject._id,
				customer_id: orderObject.customer_id,
				chef_id: orderObject.chef_id,
			};
			for (let i = 0; i < orderObject.recipes.length; i++) {
				const recipeRecord = orderObject.recipes[i];
				tempCommentObject.recipe_id = recipeRecord.recipe_id;
				tempCommentObject.count = recipeRecord.count;
				RecipeComments.insert(tempCommentObject);
				// hack code
				const temp = RecipeCount.findOne({_id: tempCommentObject.recipe_id});
				if (temp !== undefined && temp !== null) {
					RecipeCount.update({_id: tempCommentObject.recipe_id}, {$inc: {finished_count: 1}});
				} else {
					RecipeCount.insert({_id: tempCommentObject.recipe_id, finished_count: 1});
				}
			}
			Orders.update({_id: orderId, customer_id: Meteor.userId()}, {$set: {status: FINISHED, end_time: endTime}});
		}
	},
	"orders.customerPickedUpFood"(orderId) {
		if (Meteor.isServer) {
			check(orderId, String);
			if (!Meteor.userId()) {
				throw new Meteor.Error("not-authorized");
			}
			Orders.update({_id: orderId, customer_id: Meteor.userId()}, {$set: {status: PICKED_UP}});
		}
	},
	"orders.customerDeleteOrder"(orderId) {
		if (Meteor.isServer) {
			check(orderId, String);
			if (!Meteor.userId()) {
				throw new Meteor.Error("not-authorized");
			}
			Orders.remove({_id: orderId, customer_id: Meteor.userId()});
		}
	},
	"orders.chefCancel"(orderId) {
		if (Meteor.isServer) {
			check(orderId, String);
			if (!Meteor.userId()) {
				throw new Meteor.Error("not-authorized");
			}
			Orders.update({_id: orderId, chef_id: Meteor.userId()}, {$set: {status: CANCELED, end_time: new Date()}});
		}
	},
	"orders.chefConfirmCancel"(orderId) {
		if (Meteor.isServer) {
			check(orderId, String);
			if (!Meteor.userId()) {
				throw new Meteor.Error("not-authorized");
			}
			Orders.update({_id: orderId, chef_id: Meteor.userId()}, {$set: {status: CANCELED, end_time: new Date()}});
		}
	},
	"orders.chefAcceptOrder"(orderId) {
		if (Meteor.isServer) {
			check(orderId, String);
			if (!Meteor.userId()) {
				throw new Meteor.Error("not-authorized");
			}
			Orders.update({_id: orderId, chef_id: Meteor.userId()}, {$set: {status: ACCEPTED}});
		}
	},
	"orders.chefMealIsReady"(orderId) {
		if (Meteor.isServer) {
			check(orderId, String);
			if (!Meteor.userId()) {
				throw new Meteor.Error("not-authorized");
			}
			Orders.update({_id: orderId, chef_id: Meteor.userId()}, {$set: {status: READY}});
		}
	}
});