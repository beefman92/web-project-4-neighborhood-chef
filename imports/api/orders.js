import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import { NEW, ACCEPTED, READY, PICKED_UP, FINISHED, CANCELED, CANCELING } from "./order-status";

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
			Orders.update({_id: orderId, customer_id: Meteor.userId()}, {$set: {status: FINISHED}});
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
			Orders.update({_id: orderId, chef_id: Meteor.userId()}, {$set: {status: CANCELED}});
		}
	},
	"orders.chefConfirmCancel"(orderId) {
		if (Meteor.isServer) {
			check(orderId, String);
			if (!Meteor.userId()) {
				throw new Meteor.Error("not-authorized");
			}
			Orders.update({_id: orderId, chef_id: Meteor.userId()}, {$set: {status: CANCELED}});
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