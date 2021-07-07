import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import { NEW, ACCEPTED, READY, PICKED_UP, FINISHED, CANCELED, CANCELING, NO_COMMENT } from "./constants";
import { RecipeComments, ChefComments } from "./comments";

// Code revire from Xun Wang
// First of all you guys did a great job puttin gup the whole site. I know how difficult it could be to design and implement
// an order system. Great work and very solid logic and validation here!

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

			// insert recipe comment object before user leave comments so that we can get accurate statistics about
			// how many users have order this food since some users always forget to leave comments.
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
			}

			// insert chef comment object before user leave comments for the same reason as above.
			const chefCommentObject = {
				create_time: endTime,
				order_id: orderId,
				customer_id: Meteor.userId(),
				chef_id: orderObject.chef_id,
			};
			ChefComments.insert(chefCommentObject);
			Orders.update({_id: orderId, customer_id: Meteor.userId()}, {$set: {status: FINISHED, end_time: endTime, comment_status: NO_COMMENT}});
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
